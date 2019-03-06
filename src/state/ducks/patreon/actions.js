import { createAction } from 'redux-actions';

import * as types from './types';

/**
 *  Make an API request to enable Patreon.
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
 * Fetch Patreon user details from Patreon API.
 */
export const getDetails = createAction(types.GET_DETAILS);

/**
 * Save the Patreon auth state retrieved.
 */
export const storeToken = createAction(types.STORE_TOKEN);

/**
 * Save the Patreon pledge details.
 */
export const storeDetails = createAction(types.STORE_DETAILS);

/**
 * Store the error returned from the Patreon API.
 *
 * @param payload {Error}: the error object from the API request
 */
export const storeError = createAction(types.ERROR);
