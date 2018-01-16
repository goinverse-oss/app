import { createAction } from 'redux-actions';

import * as types from './types';

/**
 *  Make an API request to enable Patreon. (fake for now)
 */
export const enable = createAction(types.ENABLE_PATREON);

/**
 * Make an API request to disable Patreon. (fake for now)
 *
 * (No, this shouldn't actually require an API request;
 * it should just discard the token)
 * (Though maybe it should tell Patreon to revoke the token too)
 * (TBD)
 */
export const disable = createAction(types.DISABLE_PATREON);

/**
 * Save the Patreon auth state retrieved.
 *
 * Currently fake; just updates a boolean.
 */
export const patreonEnabled = createAction(types.PATREON_ENABLED);

/**
 * Clear the Patreon auth state.
 *
 * Currently fake; just updates a boolean.
 */
export const patreonDisabled = createAction(types.PATREON_DISABLED);

/**
 * Store the error returned from the Patreon API.
 *
 * @param payload {Error}: the error object from the API request
 */
export const patreonError = createAction(types.PATREON_ERROR);
