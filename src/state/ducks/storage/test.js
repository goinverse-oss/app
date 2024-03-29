import { of } from 'rxjs';
import { take, bufferCount } from 'rxjs/operators';

import configureStore from '../../store';

import * as actions from './actions';
import * as selectors from './selectors';
import epic from './epic';
import { getItemDownloadPath } from './utils';
import { getStateObservable } from '../testUtils';

describe('storage reducer', () => {
  const item = { type: 'blah', id: 'foo', mediaUrl: 'https://example.com/foo.mp3' };
  const path = getItemDownloadPath(item);
  let store;

  beforeEach(() => {
    ({ store } = configureStore({ noEpic: true }));
  });

  test('path map is initially empty', () => {
    expect(selectors.getDownloadPathMap(store.getState())).toEqual({});
  });

  test('storeDownload() stores a path', () => {
    store.dispatch(actions.storeDownload(item));

    const actualPath = selectors.getDownloadPath(store.getState(), item);
    expect(actualPath).toEqual(path);
  });

  test('removeDownloadMapping() removes a path', () => {
    store.dispatch(actions.storeDownload(item));
    let actualPath = selectors.getDownloadPath(store.getState(), item);
    expect(actualPath).toEqual(path);

    store.dispatch(actions.removeDownloadMapping(item));
    actualPath = selectors.getDownloadPath(store.getState(), item);
    expect(actualPath).toBeUndefined();
  });

  test('progress is initially undefined', () => {
    expect(selectors.getDownloadProgress(store.getState(), item)).toBeUndefined();
  });

  test('storeProgress() stores progress', () => {
    const progress = {
      totalBytesWritten: 42,
      totalBytesExpectedToWrite: 1200,
    };

    store.dispatch(actions.storeProgress(item, progress));
    expect(selectors.getDownloadProgress(store.getState(), item)).toEqual(progress);
  });
});

describe('storage epic', () => {
  const url = 'https://example.com/file.mp3';
  const item = {
    type: 'blah',
    id: 'foo',
    mediaUrl: url,
  };
  const fileUrl = getItemDownloadPath(item);
  let store;

  beforeEach(() => {
    ({ store } = configureStore({ noEpic: true }));
  });

  test('startDownload starts a download', async () => {
    const inputAction$ = of(actions.startDownload(item));
    const action$ = epic(inputAction$, getStateObservable(store));
    const allActions = await action$.pipe(
      take(2),
      bufferCount(2),
    ).toPromise();

    // mock savable() function returns this simplified state
    expect(allActions[0]).toEqual(actions.storeResumableDownload({ url, fileUrl }));

    expect(allActions[1]).toEqual(actions.storeDownload(item));
  });

  test('removeDownload removes a download', async () => {
    // eslint-disable-next-line
    const FileSystem = require('expo-file-system');

    const inputAction$ = of(actions.removeDownload(item));
    const action$ = epic(inputAction$, getStateObservable(store));
    const action = await action$.pipe(take(1)).toPromise();
    expect(action).toEqual(actions.removeDownloadMapping(item));

    const path = getItemDownloadPath(item);
    expect(FileSystem.deleteAsync).toHaveBeenCalledWith(path);
  });
});
