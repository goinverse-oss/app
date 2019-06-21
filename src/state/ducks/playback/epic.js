import _ from 'lodash';
import { ofType, combineEpics } from 'redux-observable';
import { REHYDRATE } from 'redux-persist';
import moment from 'moment';
import Sentry from 'sentry-expo';
import * as FileSystem from 'expo-file-system';

import { Observable, of, from } from 'rxjs';
import { switchMap, mergeMap, takeWhile, map } from 'rxjs/operators';
import { Audio } from 'expo-av';
import MusicControl from 'react-native-music-control';

import { SET_PLAYING, PLAY, PAUSE, JUMP, SEEK, SET_STATUS } from './types';
import {
  play,
  pause,
  jump,
  seek,
  setStatus,
  setSound,
  setPlaying,
  clearPlayback,
  setPendingSeek,
} from './actions';
import * as selectors from './selectors';
import { startDownload, removeDownload, removeDownloadMapping } from '../storage/actions';
import { instanceSelector } from '../orm/selectors';
import { getMediaSource, getImageSource, getCollection } from '../orm/utils';
import { getDownloadPath } from '../storage/selectors';
import showError from '../../../showError';
import { jumpSeconds } from '../../../screens/PlayerScreen/Controls';

Audio.setAudioModeAsync({
  allowsRecordingIOS: false,
  interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
  playsInSilentModeIOS: true,
  interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
  shouldDuckAndroid: false,
  playThroughEarpieceAndroid: false,
  staysActiveInBackground: true,
});

_.forEach({
  play: true,
  pause: true,
  stop: false,
  nextTrack: false,
  previousTrack: false,
  volume: true,
  remoteVolume: true,
  changePlaybackPosition: true, // iOS
  seek: true, // Android
}, (value, key) => MusicControl.enableControl(key, value));

MusicControl.enableControl('skipForward', true, { interval: 30 });
MusicControl.enableControl('skipBackward', true, { interval: 30 });

MusicControl.enableBackgroundMode(true);
MusicControl.handleAudioInterruptions(true);

function getPlaybackState(status) {
  const {
    error, isBuffering, didJustFinish, shouldPlay,
  } = status;

  if (error) {
    return MusicControl.STATE_ERROR;
  }
  if (isBuffering) {
    return MusicControl.STATE_BUFFERING;
  }
  if (didJustFinish) {
    return MusicControl.STATE_STOPPED;
  }
  return shouldPlay ? MusicControl.STATE_PLAYING : MusicControl.STATE_PAUSED;
}

function setBackgroundPlayerControls(item) {
  const status = {
    title: item.title,
    artwork: getImageSource(item).uri,
    artist: 'The Liturgists',
    album: getCollection(item).title,
    duration: moment.duration(item.duration).asSeconds(),
    description: item.description,
    date: item.publishedAt,
  };
  MusicControl.setNowPlaying(status);
}

function getLockScreenStatus(playbackStatus) {
  const { positionMillis, durationMillis, playableDurationMillis } = playbackStatus;
  const lockScreenStatus = {
    state: getPlaybackState(playbackStatus),
    elapsedTime: positionMillis ? positionMillis / 1000 : undefined,
    duration: durationMillis ? durationMillis / 1000 : undefined,
    bufferedTime: playableDurationMillis ? playableDurationMillis / 1000 : undefined,
  };
  return _.omitBy(lockScreenStatus, v => _.isUndefined(v));
}

function syncAudioStatus(state, lockScreenStatus) {
  const item = selectors.item(state);
  const status = selectors.getStatus(state);

  const newStatus = {
    ...lockScreenStatus,

    // Always update the artwork to work around a recurrent bug:
    // https://github.com/tanguyantoine/react-native-music-control/issues/98
    // https://github.com/tanguyantoine/react-native-music-control/issues/208
    artwork: getImageSource(item).uri,

    // calculate this from the actual status rather than a diff
    state: getPlaybackState(status),
  };
  MusicControl.updatePlayback(newStatus);
}

function startPlayback(state, item, shouldPlay = true) {
  const status$ = Observable.create((subscriber) => {
    const initialStatus = selectors.getLastStatusForItem(state, item.id);
    if (!_.isEmpty(initialStatus)) {
      subscriber.next(setStatus(initialStatus));
    }

    const offlinePath = getDownloadPath(state, item);
    let mediaSource = offlinePath ? { uri: offlinePath } : getMediaSource(item);
    if (!mediaSource) {
      showError('No audio URL for this item');
      subscriber.complete();
      return;
    }

    const infoPromise = (
      offlinePath
        ? FileSystem.getInfoAsync(offlinePath)
        : Promise.resolve({ exists: false })
    );

    infoPromise
      .catch((err) => {
        console.log('Getting offline file info:', err);
        Sentry.captureException(err);
        return { exists: false };
      })
      .then(({ exists }) => {
        if (!exists) {
          if (offlinePath) {
            // For some reason we've stored a path to a non-existent file.
            // Clear it out before downloading the item again.
            subscriber.next(removeDownloadMapping(item));
            mediaSource = getMediaSource(item);
          }
          subscriber.next(startDownload(item));
        }

        return Audio.Sound.createAsync(
          mediaSource,
          { ...initialStatus, shouldPlay },
          (status) => {
            subscriber.next(setStatus(status));
          },
        );
      })
      .then(({ sound }) => subscriber.next(setSound(sound)))
      .catch((err) => {
        console.log('error loading audio', mediaSource, err);
        Sentry.captureException(err);
        showError(new Error(`Failed to load URL: ${mediaSource.uri}`));
      });
  });

  return status$.pipe(takeWhile(value => !value.didJustFinish, true));
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

      setBackgroundPlayerControls(item);
      return startPlayback(state, item, shouldPlay);
    }),
  );

/**
 * RxJS operator that emits a shallow diff between items in
 * the source Observable. Emits the first source object,
 * then only emits fields that have changed. If two objects
 * in the source are shallow-identical, does not emit.
 * Keys in the optional whitelist are always included,
 * even if their values did not change.
 */
export function shallowDiff(whitelist = []) {
  return function shallowDiffOperator(source) {
    let prev = null;
    return Observable.create(subscriber => (
      source.subscribe(
        (value) => {
          if (_.isNull(prev)) {
            subscriber.next(value);
          } else if (!_.isEqual(value, prev)) {
            subscriber.next(
              _.omitBy(value, (v, k) => (
                whitelist.indexOf(k) < 0 &&
                v === prev[k]
              )),
            );
          }
          prev = value;
        },
        err => subscriber.error(err),
        () => subscriber.complete(),
      )
    ));
  };
}

const setStatusEpic = (action$, state$) =>
  action$.pipe(
    ofType(SET_STATUS),
    map(action => getLockScreenStatus(action.payload)),
    shallowDiff(['duration', 'elapsedTime']),
    switchMap((statusDiff) => {
      const state = state$.value;
      const item = selectors.item(state$.value);
      syncAudioStatus(state, statusDiff);

      if (statusDiff.didJustFinish) {
        MusicControl.resetNowPlaying();
        return of(
          removeDownload(item),
          clearPlayback(),
        );
      }
      return Observable.never();
    }),
  );

const playEpic = (action$, state$) =>
  action$.pipe(
    ofType(PLAY),
    mergeMap(() => {
      const sound = selectors.getSound(state$.value);
      sound.playAsync().catch(console.error);
      return Observable.never();
    }),
  );

const pauseEpic = (action$, state$) =>
  action$.pipe(
    ofType(PAUSE),
    mergeMap(() => {
      const sound = selectors.getSound(state$.value);
      sound.pauseAsync();
      return Observable.never();
    }),
  );

const jumpEpic = (action$, state$) =>
  action$.pipe(
    ofType(JUMP),
    switchMap((action) => {
      const jumpMillis = action.payload * 1000;
      const state = state$.value;
      const { positionMillis } = selectors.getStatus(state);
      const newPositionMillis = positionMillis + jumpMillis;

      const sound = selectors.getSound(state);
      if (sound) {
        sound.setStatusAsync({
          positionMillis: newPositionMillis,
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
        }).then(() => setPendingSeek(undefined)),
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

const lockScreenControlsEpic = () =>
  Observable.create(
    (subscriber) => {
      MusicControl.on('play', () => subscriber.next(play()));
      MusicControl.on('pause', () => subscriber.next(pause()));
      MusicControl.on('skipBackward', () => subscriber.next(jump(-jumpSeconds)));
      MusicControl.on('skipForward', () => subscriber.next(jump(jumpSeconds)));

      MusicControl.on('changePlaybackPosition', (posStr) => {
        const pos = Number.parseFloat(posStr);
        subscriber.next(seek(moment.duration(pos, 'seconds')));
      });
      MusicControl.on('seek', pos => subscriber.next(seek(moment.duration(pos, 'seconds'))));
    },
  );

export default combineEpics(
  startPlayingEpic,
  setStatusEpic,
  playEpic,
  pauseEpic,
  jumpEpic,
  seekEpic,
  resumePlaybackOnRehydrateEpic,
  lockScreenControlsEpic,
);
