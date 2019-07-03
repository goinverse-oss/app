import { persistReducer } from 'redux-persist';

import { handleActions } from 'redux-actions';

import * as types from './types';
import createSecureStore from '../../redux-persist-expo-securestore';

/* auth reducer state shape:
{
  // non-null iff the app has registered with FCM and received a token
  token: ?str,
}
*/

const defaultState = {
  token: null,
};

const persistConfig = {
  key: 'notifications',
  storage: createSecureStore(),
};

export default persistReducer(
  persistConfig,
  handleActions({
    [types.SAVE_TOKEN]: (state, action) => ({
      token: action.payload,
    }),
  }, defaultState),
);
