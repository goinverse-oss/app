import { ofType, combineEpics } from 'redux-observable';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { FileSystem } from 'expo';

import { START_DOWNLOAD, REMOVE_DOWNLOAD_ASYNC } from './types';
import { storeResumableDownload, storeDownload, removeDownload, storeProgress } from './actions';
import { getResumableDownload } from './selectors';
import { getItemBasePath, getItemDownloadPath } from './utils';
import { getMediaSource } from '../orm/utils';


const startDownloadEpic = (action$, state$) =>
  action$.pipe(
    ofType(START_DOWNLOAD),
    mergeMap(action => (
      Observable.create((subscriber) => {
        const item = action.payload;

        const minProgressMillis = 200;
        let lastUpdate = null;

        const onProgress = (progress) => {
          if (!lastUpdate || Date.now() - lastUpdate > minProgressMillis) {
            subscriber.next(storeProgress(item, progress));
            lastUpdate = Date.now();
          }
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
              getResumableDownload(state$.value, item),
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
