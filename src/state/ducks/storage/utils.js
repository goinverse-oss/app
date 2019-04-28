import { FileSystem } from 'expo';
import parse from 'url-parse';

import { getMediaSource } from '../orm/utils';

export const basePath = `${FileSystem.documentDirectory}/downloads`;

export function getItemBasePath(item) {
  const { type } = item;
  return `${basePath}/${type}`;
}

export function getItemDownloadPath(item) {
  const { id } = item;
  const mediaSource = getMediaSource(item);
  const elements = parse(mediaSource.uri).pathname.split('/');
  const filename = elements[elements.length - 1];
  return `${getItemBasePath(item)}/${id}-${filename}`;
}
