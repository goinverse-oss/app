import _ from 'lodash';
import moment from 'moment';
import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';

import orm from '../../orm';

import { RECEIVE_DATA, RECEIVE_API_ERROR } from './types';
import { getModelName } from './utils';

const defaultORMState = orm.session().state;
const defaultAPIState = {};

function momentize(modelName, obj) {
  const extraKeys = _.get({
    Meditation: ['publishedAt'],
  }, modelName, []);
  const momentKeys = ['createdAt', 'updatedAt', ...extraKeys];
  return _(obj)
    .pick(momentKeys)
    .mapValues(timestamp => moment(timestamp))
    .value();
}

export default combineReducers({
  reduxOrm: handleActions({
    [RECEIVE_DATA]: (state, action) => {
      const session = orm.session(state);

      // capture included resources as a {[type]: {[id]: obj}} mapping.
      const includedResources =
        _.get(action.payload, 'included', []).reduce(
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

      const { data } = action.payload;
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
          if (_.isArray(relData)) {
            // first, clear out old list of related objects
            const oldIds = _.map(instance[relName].toRefArray(), 'id');
            if (oldIds.length > 0) {
              instance[relName].remove(...oldIds);
            }

            // then, add all the current related objects
            if (relData.length > 0) {
              const newRels = relData.map(saveRelationship);
              instance[relName].add(...newRels);
            }
          } else {
            const relObj = saveRelationship(relData);
            instance.set(relName, relObj);
          }
        });
      });
      return session.state;
    },
  }, defaultORMState),

  api: handleActions({
    [RECEIVE_API_ERROR]: (state, action) => ({
      error: action.payload,
    }),
  }, defaultAPIState),
});
