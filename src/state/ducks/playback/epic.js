import _ from 'lodash';
import { ofType, combineEpics } from 'redux-observable';
import { REHYDRATE } from 'redux-persist';
import moment from 'moment';
import Sentry from 'sentry-expo';
import * as FileSystem from 'expo-file-system';

import { Observable, of, from } from 'rxjs';
import { switchMap, mergeMap, takeWhile } from 'rxjs/operators';
import { Audio } from 'expo-av';
import MusicControl from 'react-native-music-control';

import { SET_PLAYING, PLAY, PAUSE, JUMP, SEEK, SET_STATUS } from './types';
import { setStatus, setSound, setPlaying, clearPlayback, setPendingSeek } from './actions';
import * as selectors from './selectors';
import { startDownload, removeDownload, removeDownloadMapping } from '../storage/actions';
import { instanceSelector } from '../orm/selectors';
import { getMediaSource, getImageSource, getCollection } from '../orm/utils';
import { getDownloadPath } from '../storage/selectors';
import showError from '../../../showError';

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

function getPlaybackState(status) {
  const {
    error, isBuffering, didJustFinish, isPlaying,
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
  return isPlaying ? MusicControl.STATE_PLAYING : MusicControl.STATE_PAUSED;
}

function setBackgroundPlayerControls(item) {
  MusicControl.setNowPlaying({
    title: item.title,
    artwork: getImageSource(item).uri,
    artist: 'The Liturgists',
    album: getCollection(item).title,
    duration: moment.duration(item.duration).asSeconds(),
    description: item.description,
    date: item.publishedAt,
  });
}

function syncAudioStatus(item, status) {
  if (item) {
    const { positionMillis, durationMillis, playableDurationMillis } = status;
    setBackgroundPlayerControls(item);
    MusicControl.updatePlayback({
      state: getPlaybackState(status),
      elapsedTime: positionMillis ? positionMillis / 1000 : undefined,
      duration: durationMillis ? durationMillis / 1000 : undefined,
      bufferedTime: playableDurationMillis ? playableDurationMillis / 1000 : undefined,
    });
  } else {
    MusicControl.resetNowPlaying();
  }
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
        console.log('error loading audio', mediaSource);
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

      return startPlayback(state, item, shouldPlay);
    }),
  );

const setStatusEpic = (action$, state$) =>
  action$.pipe(
    ofType(SET_STATUS),
    switchMap((action) => {
      const status = action.payload;
      const item = selectors.item(state$.value);
      syncAudioStatus(item, status);

      if (status.didJustFinish) {
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
      const item = selectors.item(state$.value);
      setBackgroundPlayerControls(item);
      sound.playAsync();
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
      const item = selectors.item(state);
      return from(
        sound.setStatusAsync({
          positionMillis: action.payload.asMilliseconds(),
        }).then((status) => {
          syncAudioStatus(item, status);
          return setPendingSeek(undefined);
        }),
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
  setStatusEpic,
  playEpic,
  pauseEpic,
  jumpEpic,
  seekEpic,
  resumePlaybackOnRehydrateEpic,
);
