import { handleActions } from '../../utils/reduxActions';

import { SET_SHOW_WELCOME } from './types';

/* welcome reducer state shape:
{
  showWelcome: bool
}
*/

const defaultState = {
  showWelcome: true,
};

export default handleActions({
  [SET_SHOW_WELCOME]: (state, action) => ({
    showWelcome: action.payload,
  }),
}, defaultState);
