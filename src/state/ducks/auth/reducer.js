import { handleActions } from 'redux-actions';

import * as types from './types';

/* auth reducer state shape:
{
  // true iff the user is authenticated
  authenticated: boolean,
}
*/

const defaultState = {
  authenticated: false,
};

export default handleActions({
  [types.LOGIN]: () => ({
    authenticated: true,
  }),
  [types.LOGOUT]: () => ({
    authenticated: false,
  }),
}, defaultState);
