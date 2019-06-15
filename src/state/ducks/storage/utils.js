import parse from 'url-parse';
import path from 'path-browserify';
import * as FileSystem from 'expo-file-system';

import { getMediaSource } from '../orm/utils';

export const basePath = FileSystem.documentDirectory;

export function getItemDownloadRelativePath(item) {
  const { id, type } = item;
  const mediaSource = getMediaSource(item);
  const elements = parse(mediaSource.uri).pathname.split('/');
  const filename = elements[elements.length - 1];
  return path.join('downloads', type, `${id}-${filename}`);
}

export function getItemDownloadPath(item) {
  return path.join(basePath, getItemDownloadRelativePath(item));
}
