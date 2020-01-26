import { handleActions } from '../../utils/reduxActions';

import {
  CONNECT,
  DISCONNECT,
  STORE_TOKEN,
  GET_DETAILS,
  STORE_DETAILS,
  ERROR,
  SET_WAITING_FOR_DEVICE_VERIFICATION,
} from './types';

/* patreon reducer state shape:
{
  // non-null iff the user has connected Patreon
  token: ?string,

  // true iff we are waiting for a response from the Patreon API
  loading: boolean,

  // if not null, the error from the last Patreon API call
  error: ?Error,
}
*/

const defaultState = {
  token: null,
  loading: false,
  waitingForDeviceVerification: false,
};

export default handleActions({
  [CONNECT]: state => ({
    ...state,
    error: null,
    loading: true,
    waitingForDeviceVerification: false,
  }),
  [DISCONNECT]: () => ({
    token: null,
    error: null,
    loading: false,
  }),
  [STORE_TOKEN]: state => ({
    ...state,
  }),
  [GET_DETAILS]: state => ({
    ...state,
    loading: true,
  }),
  [STORE_DETAILS]: (state, action) => ({
    ...state,
    details: action.payload,
    loading: false,
  }),
  [ERROR]: (state, action) => ({
    ...state,
    error: action.payload,
    loading: false,
  }),
  [SET_WAITING_FOR_DEVICE_VERIFICATION]: state => ({
    ...state,
    loading: false,
    waitingForDeviceVerification: true,
  }),
}, defaultState);
