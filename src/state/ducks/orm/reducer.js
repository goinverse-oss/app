import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';

import orm from '../../orm';

import { RECEIVE_DATA, RECEIVE_API_ERROR } from './types';
import { getModelName } from './utils';

const defaultORMState = orm.session().state;
const defaultAPIState = {};

export default combineReducers({
  reduxOrm: handleActions({
    [RECEIVE_DATA]: (state, action) => {
      const session = orm.session(state);
      action.payload.data.forEach((item) => {
        const modelName = getModelName(item.type);
        const Model = session[modelName];
        Model.upsert({
          id: item.id,
          ...item.attributes,
        });
        // TODO: handle relationships
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
