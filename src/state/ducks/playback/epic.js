import { ofType, combineEpics } from 'redux-observable';
import { REHYDRATE } from 'redux-persist';

import { Observable } from 'rxjs';
import { switchMap, mergeMap } from 'rxjs/operators';
import { Audio } from 'expo';

import { SET_PLAYING, PLAY, PAUSE, JUMP, SEEK } from './types';
import { setStatus, setSound, setPendingSeek } from './actions';
import * as selectors from './selectors';
import { instanceSelector } from '../orm/selectors';
import { getMediaSource } from '../orm/utils';
import showError from '../../../showError';

function startPlayback(item, initialStatus = {}, shouldPlay = true) {
  const mediaSource = getMediaSource(item);
  if (!mediaSource) {
    showError('No audio URL for this item');
    return Observable.never();
  }

  return Observable.create((subscriber) => {
    Audio.Sound.createAsync(
      mediaSource,
      { ...initialStatus, shouldPlay },
      status => subscriber.next(
        setStatus(status),
      ),
    )
      .then(({ sound }) => subscriber.next(setSound(sound)));
  });
}

const startPlayingEpic = (action$, store) =>
  action$.pipe(
    ofType(SET_PLAYING),
    switchMap((action) => {
      const state = store.getState();
      const { type, id } = action.payload;
      const item = instanceSelector(state, type, id);
      const prevSound = selectors.getSound(state);
      if (prevSound) {
        prevSound.stopAsync();
      }

      const initialStatus = selectors.getLastStatusForItem(state, id);

      return startPlayback(item, initialStatus);
    }),
  );

const playEpic = (action$, store) =>
  action$.pipe(
    ofType(PLAY),
    mergeMap(() => {
      selectors.getSound(store.getState()).playAsync();
      return Observable.never();
    }),
  );

const pauseEpic = (action$, store) =>
  action$.pipe(
    ofType(PAUSE),
    mergeMap(() => {
      selectors.getSound(store.getState()).pauseAsync();
      return Observable.never();
    }),
  );

const jumpEpic = (action$, store) =>
  action$.pipe(
    ofType(JUMP),
    mergeMap((action) => {
      const jumpMillis = action.payload * 1000;
      const state = store.getState();
      const status = selectors.getStatus(state);
      const positionMillis = status.positionMillis + jumpMillis;

      const sound = selectors.getSound(state);
      if (sound) {
        sound.setStatusAsync({
          positionMillis,
        });
      }
      return Observable.never();
    }),
  );

const seekEpic = (action$, store) =>
  action$.pipe(
    ofType(SEEK),
    mergeMap((action) => {
      const state = store.getState();
      const sound = selectors.getSound(state);
      return Observable.fromPromise(
        sound.setStatusAsync({
          positionMillis: action.payload.asMilliseconds(),
        }).then(() => (
          setPendingSeek(undefined)
        )),
      );
    }),
  );

const resumePlaybackOnRehydrateEpic = (action$, store) =>
  action$.pipe(
    ofType(REHYDRATE),
    mergeMap((action) => {
      if (action.key !== 'playback') {
        return Observable.never();
      }

      const state = store.getState();
      const item = selectors.item(state);
      const status = selectors.getStatus(state);
      if (item) {
        // load the sound, but don't immediately start playback
        return startPlayback(item, status, false);
      }

      return Observable.never();
    }),
  );

export default combineEpics(
  startPlayingEpic,
  playEpic,
  pauseEpic,
  jumpEpic,
  seekEpic,
  resumePlaybackOnRehydrateEpic,
);
