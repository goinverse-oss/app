import { FileSystem } from 'expo';

export const basePath = `${FileSystem.documentDirectory}/downloads`;

export function getItemBasePath(item) {
  const { type } = item;
  return `${basePath}/${type}`;
}

export function getItemDownloadPath(item) {
  const { id } = item;
  return `${getItemBasePath(item)}/${id}`;
}
