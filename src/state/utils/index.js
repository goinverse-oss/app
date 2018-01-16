export const REDUX_ACTIONS_SCOPE = 'theliturgists/app';

/**
 * Return an action type scoped to the app.
 *
 * @param {string} type - the unscoped type
 * @return {string} the scoped type
 */
export function scopedType(type) {
  return `${REDUX_ACTIONS_SCOPE}/${type}`;
}
