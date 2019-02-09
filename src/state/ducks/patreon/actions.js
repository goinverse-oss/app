import { createAction } from 'redux-actions';

import * as types from './types';

/**
 *  Make an API request to enable Patreon. (fake for now)
 */
export const connect = createAction(types.CONNECT);

/**
 * Clear the Patreon auth state.
 *
 * (maybe it should tell Patreon to revoke the token too)
 * (TBD)
 */
export const disconnect = createAction(types.DISCONNECT);

/**
 * Save the Patreon auth state retrieved.
 *
 * Currently fake; just updates a boolean.
 */
export const storeToken = createAction(types.STORE_TOKEN);

/**
 * Store the error returned from the Patreon API.
 *
 * @param payload {Error}: the error object from the API request
 */
export const storeError = createAction(types.ERROR);
