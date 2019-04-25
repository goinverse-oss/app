import { ofType, combineEpics } from 'redux-observable';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { FileSystem } from 'expo';

import { START_DOWNLOAD, REMOVE_DOWNLOAD_ASYNC } from './types';
import { storeResumableDownload, storeDownload, removeDownload, storeProgress } from './actions';
import { getResumableDownload } from './selectors';
import { getItemBasePath, getItemDownloadPath } from './utils';
import { getMediaSource } from '../orm/utils';


const startDownloadEpic = (action$, store) =>
  action$.pipe(
    ofType(START_DOWNLOAD),
    mergeMap(action => (
      Observable.create((subscriber) => {
        const item = action.payload;

        const onProgress = (progress) => {
          subscriber.next(storeProgress(item, progress));
        };

        const basePath = getItemBasePath(item);
        const itemPath = getItemDownloadPath(item);
        const mediaSource = getMediaSource(item);
        if (!mediaSource.uri) {
          subscriber.complete();
          return;
        }

        FileSystem.makeDirectoryAsync(basePath, { intermediates: true })
          .then(() => {
            const download = FileSystem.createDownloadResumable(
              mediaSource.uri,
              itemPath,
              {},
              onProgress,
              getResumableDownload(store.getState(), item),
            );
            subscriber.next(storeResumableDownload(download.savable()));
            download.downloadAsync()
              .then(() => subscriber.next(storeDownload(item)));
          });
      })
    )),
  );

const removeDownloadEpic = action$ =>
  action$.pipe(
    ofType(REMOVE_DOWNLOAD_ASYNC),
    mergeMap(action => (
      Observable.create((subscriber) => {
        const item = action.payload;
        const itemPath = getItemDownloadPath(item);
        FileSystem.removeAsync(itemPath)
          .then(() => subscriber.next(removeDownload(item)));
      })
    )),
  );

export default combineEpics(startDownloadEpic, removeDownloadEpic);
