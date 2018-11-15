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

export function elapsed(state) {
  const millis = state.playback.status.positionMillis;
  const seconds = Math.floor(millis / 1000);
  return moment.duration(seconds, 'seconds');
}

export function getSound(state) {
  return state.playback.sound;
}