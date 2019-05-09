import { createAction } from 'redux-actions';

import * as types from './types';

/**
 * Set flag that determines whether to show the welcome screens.
 *
 * @param {bool} showWelcome
 */
export const setShowWelcome = createAction(types.SET_SHOW_WELCOME);
