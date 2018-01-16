import { handleActions } from '../../utils/reduxActions';

import { ENABLE_PATREON, DISABLE_PATREON } from './types';

const defaultState = {
  enabled: false,
};

export default handleActions({
  [ENABLE_PATREON]: () => ({
    enabled: true,
  }),
  [DISABLE_PATREON]: () => ({
    enabled: false,
  }),
}, defaultState);
