import _ from 'lodash';
import moment from 'moment';
import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';

import orm from '../../orm';

import { FETCH_DATA, RECEIVE_DATA, RECEIVE_API_ERROR } from './types';
import { getModelName } from './utils';

const defaultORMState = orm.session().state;
const defaultAPIState = {};

function momentize(modelName, obj) {
  const extraKeys = _.get({
    Meditation: ['publishedAt'],
  }, modelName, []);
  const momentKeys = ['createdAt', 'updatedAt', ...extraKeys];
  const durationKeys = ['duration'];
  return {
    ..._(obj)
      .pick(momentKeys)
      .mapValues(timestamp => moment(timestamp))
      .value(),
    ..._(obj)
      .pick(durationKeys)
      .mapValues(duration => moment.duration(duration))
      .value(),
  };
}

export default combineReducers({
  reduxOrm: handleActions({
    [RECEIVE_DATA]: (state, action) => {
      const session = orm.session(state);

      // capture included resources as a {[type]: {[id]: obj}} mapping.
      const includedResources =
        _.get(action.payload.json, 'included', []).reduce(
          (mapping, obj) => (
            _.setWith(mapping, [obj.type, obj.id], obj, Object)
          ),
          {},
        );

      function saveRelationship(relData) {
        const { type, id } = relData;
        const attributes = _.get(
          includedResources,
          [type, id, 'attributes'],
          {},
        );
        const relModelName = getModelName(type);
        const RelModel = session[relModelName];
        return RelModel.upsert({
          id,
          ...attributes,
          ...momentize(relModelName, attributes),
        });
      }

      const { data } = action.payload.json;
      (_.isArray(data) ? data : [data]).forEach((item) => {
        const modelName = getModelName(item.type);
        const Model = session[modelName];
        const instance = Model.upsert({
          id: item.id,
          ...item.attributes,
          ...momentize(modelName, item.attributes),
        });
        _.each(_.get(item, 'relationships', {}), (rel, relName) => {
          const { data: relData } = rel;
          let newRel;
          if (_.isArray(relData)) {
            // Redux-ORM handles the merge of new and old arrays
            newRel = relData.map(saveRelationship);
          } else {
            newRel = saveRelationship(relData);
          }

          instance.update({
            [relName]: newRel,
          });
        });
      });
      return session.state;
    },
  }, defaultORMState),

  api: handleActions({
    [FETCH_DATA]: (state, action) => ({
      loading: {
        ...state.loading,
        [action.payload.resource]: true,
      },
    }),
    [RECEIVE_DATA]: (state, action) => ({
      loading: {
        ...state.loading,
        [action.payload.resource]: false,
      },
    }),
    [RECEIVE_API_ERROR]: (state, action) => ({
      error: action.payload.error,
    }),
  }, defaultAPIState),
});
