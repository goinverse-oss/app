import { createAction } from 'redux-actions';

import * as types from './types';

/**
 * Store the specified media item's file path.
 *
 * @param {object} payload keys 'id' and 'path'
 *   id: contentful id
 *   path: file:// path to media file
 */
export const store = createAction(types.STORE);

/**
 * Remove the specified media item from the path map.
 *
 * @param {string} id contentful id
 */
export const remove = createAction(types.REMOVE);
