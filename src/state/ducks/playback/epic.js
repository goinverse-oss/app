import { ofType, combineEpics } from 'redux-observable';

// redux-observable pulls in a minimal subset of RxJS
// to keep the bundle size small, so here we explicitly
// pull in just the things we need, including operators
// on Observable. It's a little weird, but you get used
// to the error messages that tell you you need to import
// another operator.
// https://redux-observable.js.org/docs/Troubleshooting.html
import { Observable } from 'rxjs/Observable';
import { mergeMap } from 'rxjs/operators';
import { Audio } from 'expo';
import moment from 'moment';

import { SET_PLAYING, PLAY, PAUSE } from './types';
import { setElapsed, setSound } from './actions';
import * as selectors from './selectors';
import { instanceSelector } from '../orm/selectors';

function startPlayback(mediaUrl) {
  return Observable.create((subscriber) => {
    Audio.Sound.createAsync(
      { uri: mediaUrl },
      { shouldPlay: true },
      status => subscriber.next(
        setElapsed(moment.duration(status.positionMillis)),
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

      // XXX: returning this here results in the Observable getting
      // dispatch()ed by redux-observable.
      // TODO: figure out why, and properly return the actions that
      // this observable emits instead.
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

export default combineEpics(startPlayingEpic, playEpic, pauseEpic);
