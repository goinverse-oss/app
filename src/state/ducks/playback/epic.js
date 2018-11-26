import { ofType, combineEpics } from 'redux-observable';

import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { Audio } from 'expo';

import { SET_PLAYING, PLAY, PAUSE, JUMP, SEEK } from './types';
import { setStatus, setSound, setPendingSeek } from './actions';
import * as selectors from './selectors';
import { instanceSelector } from '../orm/selectors';

function startPlayback(mediaUrl) {
  return Observable.create((subscriber) => {
    Audio.Sound.createAsync(
      { uri: mediaUrl },
      { shouldPlay: true },
      status => subscriber.next(
        setStatus(status),
      ),
    )
      .then(({ sound }) => subscriber.next(setSound(sound)));
  });
}

/**
 * Update playback state while playing.
 *
 * Handles:
 *   SET_PLAYING, PLAY: start/resume playback timer
 *   PAUSE: pause playback
 * Emits:
 *   SET_ELAPSED: update the elapsed time each second
 *     while playback is in progress
 */
const startPlayingEpic = (action$, store) =>
  action$.pipe(
    ofType(SET_PLAYING),
    mergeMap((action) => {
      const state = store.getState();
      const { type, id } = action.payload;
      const { mediaUrl } = instanceSelector(state, type, id);
      const prevSound = selectors.getSound(state);
      if (prevSound) {
        prevSound.stopAsync();
      }

      return startPlayback(mediaUrl);
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
      sound.setStatusAsync({
        positionMillis,
      });
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

export default combineEpics(startPlayingEpic, playEpic, pauseEpic, jumpEpic, seekEpic);
