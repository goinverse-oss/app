import _ from 'lodash';
import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';
import { persistReducer, createMigrate } from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';

import orm from '../../orm';

import { FETCH_DATA, RECEIVE_DATA, RECEIVE_ASSET, RECEIVE_API_ERROR } from './types';
import { getModelName, getContentType, getFields, getRelationships, getAssets } from './utils';

const defaultORMState = orm.session().state;
const defaultAssetsState = {};
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

const migrations = {
  // reset the previous state to work around the temporary state
  // where liturgy-related keys don't get merged properly.
  0: () => ({
    ...defaultORMState,
  }),
};

// Use a separate persisted reducer here so that
// merges happen at this level, allowing us to add new fields
// without the empty-table state getting blown away by
// the PERSIST action.
const reduxOrmReducer = persistReducer(
  {
    key: 'reduxOrm',
    storage: AsyncStorage,
    version: 0,
    migrate: createMigrate(migrations),
  },
  handleActions({
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
);

export default persistReducer(
  {
    key: 'orm',
    storage: AsyncStorage,
    blacklist: ['reduxOrm'],
  },
  combineReducers({
    reduxOrm: reduxOrmReducer,

    assets: handleActions({
      [RECEIVE_ASSET]: (state, action) => ({
        ...state,
        [action.payload.key]: action.payload.asset,
      }),
    }, defaultAssetsState),

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
  }),
);
