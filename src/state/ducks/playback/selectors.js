import _ from 'lodash';
import moment from 'moment';

import { instanceSelector } from '../orm/selectors';

export function item(state) {
  if (!state.playback.item) {
    return null;
  }
  const { type, id } = state.playback.item;
  return instanceSelector(state, type, id);
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

export function getLastStatusForItem(state, id) {
  return _.get(state.playback.playbackStatusPerItem, id, {});
}

export function elapsed(state) {
  if (state.playback.pendingSeekDestination) {
    return state.playback.pendingSeekDestination;
  }

  const millis = _.get(getStatus(state), 'positionMillis', 0);
  const seconds = Math.floor(millis / 1000);
  return moment.duration(seconds, 'seconds');
}

export function duration(state) {
  const millis = _.get(getStatus(state), 'durationMillis', 0);
  if (millis) {
    const seconds = Math.floor(millis / 1000);
    return moment.duration(seconds, 'seconds');
  }

  return item(state).duration;
}

export function getSound(state) {
  return state.playback.sound;
}
