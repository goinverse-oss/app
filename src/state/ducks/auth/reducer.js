import { persistReducer } from 'redux-persist';
import createSecureStore from 'redux-persist-expo-securestore';

import { handleActions } from 'redux-actions';

import * as patreonTypes from '../patreon/types';

/* auth reducer state shape:
{
  // true iff the user has connected Patreon
  patreonToken: ?str,
}
*/

const defaultState = {
  patreonToken: null,
};

const persistConfig = {
  key: 'auth',
  storage: createSecureStore(),
};

export default persistReducer(
  persistConfig,
  handleActions({
    [patreonTypes.STORE_TOKEN]: (state, action) => ({
      ...action.payload,
    }),
    [patreonTypes.DISCONNECT]: () => ({
      patreonToken: null,
    }),
  }, defaultState),
);
