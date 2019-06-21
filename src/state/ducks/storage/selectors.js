import _ from 'lodash';
import * as FileSystem from 'expo-file-system';

export function getDownloadPathMap(state) {
  return state.storage.items;
}

export function getDownloadPath(state, item) {
  const relPath = _.get(state.storage.items, item.id);
  return relPath ? `${FileSystem.documentDirectory}${relPath}` : undefined;
}

export function getDownloadProgress(state, item) {
  return _.get(state.storage.progress, item.id);
}

export function getResumableDownload(state, item) {
  return _.get(state.storage.resumableDownloads, item.id);
}
