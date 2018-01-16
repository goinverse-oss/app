import { handleActions } from '../../utils/reduxActions';

import {
  ENABLE_PATREON,
  DISABLE_PATREON,
  PATREON_ENABLED,
  PATREON_DISABLED,
  PATREON_ERROR,
} from './types';

/* patreon reducer state shape:
{
  // true iff the user has connected Patreon
  enabled: boolean,

  // true iff we are waiting for a response from the Patreon API
  loading: boolean,

  // if not null, the error from the last Patreon API call
  error: ?Error,
}
*/

const defaultState = {
  enabled: false,
  loading: false,
};

export default handleActions({
  [ENABLE_PATREON]: state => ({
    ...state,
    error: null,
    loading: true,
  }),
  [DISABLE_PATREON]: state => ({
    ...state,
    error: null,
    loading: true,
  }),
  [PATREON_ENABLED]: () => ({
    enabled: true,
    loading: false,
  }),
  [PATREON_DISABLED]: () => ({
    enabled: false,
    loading: false,
  }),
  [PATREON_ERROR]: (state, action) => ({
    ...state,
    error: action.payload,
    loading: false,
  }),
}, defaultState);
