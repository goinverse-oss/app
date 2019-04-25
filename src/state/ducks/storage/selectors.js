import _ from 'lodash';

export function getDownloadPathMap(state) {
  return state.storage.items;
}

export function getDownloadPath(state, item) {
  return _.get(state.storage.items, item.id);
}

export function getDownloadProgress(state, item) {
  return _.get(state.storage.progress, item.id);
}

export function getResumableDownload(state, item) {
  return _.get(state.storage.resumableDownloads, item.id);
}
