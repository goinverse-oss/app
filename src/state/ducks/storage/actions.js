import { createAction } from 'redux-actions';

import * as types from './types';

/**
 * Store a resumable download object.
 *
 * @param {object} resumableDownload
 */
export const storeResumableDownload = createAction(types.STORE_RESUMABLE_DOWNLOAD);

/**
 * Start downloading the specified media item.
 *
 * @param {object} item media item
 */
export const startDownload = createAction(types.START_DOWNLOAD);

/**
 * Store the progress of the specified download.
 *
 * @param {object} item media item
 * @param {object} progress progress data with these keys:
 *   totalBytesWritten
 *   totalBytesExpectedToWrite
 */
export const storeProgress = createAction(
  types.STORE_PROGRESS,
  (item, progress) => ({ item, progress }),
);

/**
 * Store the specified media item's file path.
 *
 * @param {object} item media item
 */
export const storeDownload = createAction(types.STORE_DOWNLOAD);

/**
 * Remove the specified media item from the file map.
 * Does not actually remove the file from storage!
 *
 * @param {object} item media item
 */
export const removeDownloadMapping = createAction(types.REMOVE_DOWNLOAD_MAPPING);

/**
 * Remove the specified media item, including the file.
 *
 * @param {object} item media item
 */
export const removeDownload = createAction(types.REMOVE_DOWNLOAD);
