import _ from 'lodash';
import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';

import orm from '../../orm';

import { FETCH_DATA, RECEIVE_DATA, RECEIVE_API_ERROR } from './types';
import { getModelName, getContentType, getFields, getRelationships } from './utils';

const defaultORMState = orm.session().state;
const defaultAPIState = {};

function getTimestamps(modelName, entry) {
  const timestamps = {
    createdAt: entry.sys.createdAt,
    updatedAt: entry.sys.updatedAt,
  };
  if (_.has(entry, 'fields.publishedAt')) {
    timestamps.publishedAt = entry.fields.publishedAt;
  }
  if (_.has(entry, 'fields.duration')) {
    timestamps.duration = entry.fields.duration;
  }
  return timestamps;
}

export default combineReducers({
  reduxOrm: handleActions({
    [RECEIVE_DATA]: (state, action) => {
      const session = orm.session(state);

      function saveRelationship(relatedEntry) {
        const relModelName = getModelName(getContentType(relatedEntry));
        const RelModel = session[relModelName];
        const relJson = {
          id: relatedEntry.sys.id,
          ...getFields(relatedEntry),
          ...getTimestamps(relModelName, relatedEntry),
        };
        return RelModel.upsert(relJson);
      }

      const data = action.payload.json;
      (_.isArray(data.items) ? data.items : [data]).forEach((item) => {
        const modelName = getModelName(getContentType(item));
        const Model = session[modelName];
        const instanceJson = {
          id: item.sys.id,
          ...getFields(item),
          ...getTimestamps(modelName, item),
        };
        const instance = Model.upsert(instanceJson);
        _.each(getRelationships(item), (relatedEntry, relName) => {
          let newRel;
          if (_.isArray(relatedEntry)) {
            // Redux-ORM handles the merge of new and old arrays
            newRel = relatedEntry.map(saveRelationship);
          } else {
            newRel = saveRelationship(relatedEntry);
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
