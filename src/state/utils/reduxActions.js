// Wrapper for redux-actions that does some extra sanity-checking
// to avoid common gotchas.

import _ from 'lodash';
import { handleActions as origHandleActions } from 'redux-actions';

export { createAction } from 'redux-actions';

/**
 * Wrapper for redux-actions handleActions that disallows undefined keys.
 */
export function handleActions(reducerMap, defaultState) {
  const keys = _.keys(reducerMap);
  if (_.some(keys, _.isUndefined) || _.some(keys, key => (key === 'undefined'))) {
    throw Error('`undefined` is not a valid key in a handleActions reducer map');
  }

  return origHandleActions(reducerMap, defaultState);
}
