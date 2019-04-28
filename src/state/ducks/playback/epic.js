import _ from 'lodash';
import { ofType, combineEpics } from 'redux-observable';
import { REHYDRATE } from 'redux-persist';

import { Observable, of, from, merge } from 'rxjs';
import { switchMap, mergeMap } from 'rxjs/operators';
import { Audio } from 'expo';

import { SET_PLAYING, PLAY, PAUSE, JUMP, SEEK } from './types';
import { setStatus, setSound, setPlaying, setPendingSeek } from './actions';
import * as selectors from './selectors';
import { startDownload } from '../storage/actions';
import { instanceSelector } from '../orm/selectors';
import { getMediaSource } from '../orm/utils';
import { getDownloadPath } from '../storage/selectors';
import showError from '../../../showError';

function startPlayback(mediaSource, initialStatus = {}, shouldPlay = true) {
  return Observable.create((subscriber) => {
    if (!_.isEmpty(initialStatus)) {
      subscriber.next(setStatus(initialStatus));
    }

    Audio.Sound.createAsync(
      mediaSource,
      { ...initialStatus, shouldPlay },
      (status) => {
        subscriber.next(setStatus(status));
      },
    )
      .then(({ sound }) => subscriber.next(setSound(sound)));
  });
}

const startPlayingEpic = (action$, state$) =>
  action$.pipe(
    ofType(SET_PLAYING),
    switchMap((action) => {
      const state = state$.value;
      const { type, id, shouldPlay } = action.payload;
      const item = instanceSelector(state, type, id);
      const prevSound = selectors.getSound(state);
      if (prevSound) {
        prevSound.stopAsync();
      }

      const initialStatus = selectors.getLastStatusForItem(state, id);

      const offlinePath = getDownloadPath(state, item);
      if (offlinePath) {
        const mediaSource = { uri: offlinePath };
        return startPlayback(mediaSource, initialStatus, shouldPlay);
      }

      const mediaSource = getMediaSource(item);
      if (!mediaSource) {
        showError('No audio URL for this item');
        return Observable.never();
      }

      return merge(
        of(startDownload(item)),
        startPlayback(mediaSource, initialStatus, shouldPlay),
      );
    }),
  );

const playEpic = (action$, state$) =>
  action$.pipe(
    ofType(PLAY),
    mergeMap(() => {
      selectors.getSound(state$.value).playAsync();
      return Observable.never();
    }),
  );

const pauseEpic = (action$, state$) =>
  action$.pipe(
    ofType(PAUSE),
    mergeMap(() => {
      selectors.getSound(state$.value).pauseAsync();
      return Observable.never();
    }),
  );

const jumpEpic = (action$, state$) =>
  action$.pipe(
    ofType(JUMP),
    switchMap((action) => {
      const jumpMillis = action.payload * 1000;
      const state = state$.value;
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

const seekEpic = (action$, state$) =>
  action$.pipe(
    ofType(SEEK),
    switchMap((action) => {
      const state = state$.value;
      const sound = selectors.getSound(state);
      return from(
        sound.setStatusAsync({
          positionMillis: action.payload.asMilliseconds(),
        }).then(() => (
          setPendingSeek(undefined)
        )),
      );
    }),
  );

const resumePlaybackOnRehydrateEpic = (action$, state$) =>
  action$.pipe(
    ofType(REHYDRATE),
    switchMap((action) => {
      if (action.key !== 'playback') {
        return Observable.never();
      }

      const state = state$.value;
      const item = selectors.item(state);
      if (!item) {
        return Observable.never();
      }
      return of(setPlaying(item, false));
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
