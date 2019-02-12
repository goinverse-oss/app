import { handleActions } from '../../utils/reduxActions';

import {
  CONNECT,
  DISCONNECT,
  STORE_TOKEN,
  GET_DETAILS,
  STORE_DETAILS,
  ERROR,
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
};

export default handleActions({
  [CONNECT]: state => ({
    ...state,
    error: null,
    loading: true,
  }),
  [DISCONNECT]: () => ({
    token: null,
    error: null,
    loading: false,
  }),
  [STORE_TOKEN]: (state, action) => ({
    token: action.payload,
    loading: false,
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
}, defaultState);
