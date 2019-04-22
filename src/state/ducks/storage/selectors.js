import _ from 'lodash';

export function getPathMap(state) {
  return state.storage.items;
}

export function getPath(state, id) {
  return _.get(state.storage.items, id);
}
