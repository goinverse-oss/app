import { createAction } from 'redux-actions';

import * as types from './types';

/**
 * Save the FCM token.
 *
 * @param {string} token the token value
 */
export const saveToken = createAction(types.SAVE_TOKEN);
