import { handleActions } from '../../utils/reduxActions';

import {
  CONNECT,
  DISCONNECT,
  STORE_TOKEN,
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
  [DISCONNECT]: state => ({
    ...state,
    token: null,
    error: null,
  }),
  [STORE_TOKEN]: (state, action) => ({
    token: action.payload,
    loading: false,
  }),
  [ERROR]: (state, action) => ({
    ...state,
    error: action.payload,
    loading: false,
  }),
}, defaultState);
