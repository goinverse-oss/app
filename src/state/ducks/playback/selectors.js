import _ from 'lodash';
import moment from 'moment';

import { instanceSelector } from '../orm/selectors';

export function item(state) {
  const { type, id } = state.playback.item;
  return instanceSelector(state, type, id);
}

export function isPlaying(state) {
  return state.playback.playing;
}

export function isPaused(state) {
  return state.playback.paused;
}

export function isLoading(state) {
  return !_.get(state.playback, 'status.isLoaded', false);
}

export function isBuffering(state) {
  return _.get(state.playback, 'status.isBuffering', false);
}

export function getStatus(state) {
  return state.playback.status;
}

export function elapsed(state) {
  if (state.playback.pendingSeekDestination) {
    return state.playback.pendingSeekDestination;
  }

  const millis = getStatus(state).positionMillis || 0;
  const seconds = Math.floor(millis / 1000);
  return moment.duration(seconds, 'seconds');
}

export function duration(state) {
  const millis = getStatus(state).durationMillis;
  if (millis) {
    const seconds = Math.floor(millis / 1000);
    return moment.duration(seconds, 'seconds');
  }

  return item(state).duration;
}

export function getSound(state) {
  return state.playback.sound;
}
