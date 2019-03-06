import _ from 'lodash';
import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';

import orm from '../../orm';

import { FETCH_DATA, RECEIVE_DATA, RECEIVE_API_ERROR } from './types';
import { getModelName, getContentType, getFields, getRelationships, getAssets } from './utils';

const defaultORMState = orm.session().state;
const defaultAPIState = {};

function getTimestamps(modelName, entry) {
  const timestamps = {
    createdAt: entry.sys.createdAt,
    updatedAt: entry.sys.updatedAt,

    // allow overriding with explicit field, but fall back
    // to updatedAt, which is the actual last publish timestamp
    publishedAt: _.get(entry, 'fields.publishedAt', entry.sys.updatedAt),
  };
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
          ...getAssets(relatedEntry),
          ...getTimestamps(relModelName, relatedEntry),
        };
        return RelModel.upsert(relJson);
      }

      const data = action.payload.json;
      if (_.isArray(data.items)) {
        // Replace any existing instances of this model
        // with what we're receiving from the server
        const newIds = new Set(_.map(data.items, 'sys.id'));
        const modelName = getModelName(action.payload.resource);
        const Model = session[modelName];
        let querySet = Model.all();
        const { collection } = action.payload;
        if (collection) {
          // Filtered refresh (not actually used at the moment; left over
          // from a previous iteration)
          querySet = querySet.filter(
            // in reducers, relations are _just_ the id of the related object
            obj => obj[collection.field] === collection.id,
          );
        }
        querySet = querySet.filter(
          obj => !newIds.has(obj.id),
        );
        querySet.delete();
      }

      (_.isArray(data.items) ? data.items : [data]).forEach((item) => {
        const modelName = getModelName(getContentType(item));
        const Model = session[modelName];
        const instanceJson = {
          id: item.sys.id,
          ...getFields(item),
          ...getAssets(item),
          ...getTimestamps(modelName, item),
        };
        const instance = Model.upsert(instanceJson);
        _.each(getRelationships(item), (relatedEntry, relName) => {
          let newRel;
          if (relatedEntry) {
            if (_.isArray(relatedEntry)) {
              // Redux-ORM handles the merge of new and old arrays
              newRel = relatedEntry.map(saveRelationship);
            } else {
              newRel = saveRelationship(relatedEntry);
            }

            instance.update({
              [relName]: newRel,
            });
          }
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
