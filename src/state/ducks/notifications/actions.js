import { createAction } from 'redux-actions';

import * as types from './types';

/**
 * Save the FCM token.
 *
 * @param {string} token the token value
 */
export const saveToken = createAction(types.SAVE_TOKEN);

/**
 * Subscribe to the right patron media notification topic(s).
 */
export const updatePatronNotificationSubscriptions =
  createAction(types.UPDATE_PATRON_NOTIFICATION_SUBSCRIPTIONS);
