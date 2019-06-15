import _ from 'lodash';
import { createAction } from 'redux-actions';

import * as types from './types';

/**
 * Set the provided item to be playing.
 *
 * @param {PodcastEpisode|Meditation|LiturgyItem} item media item to play
 * @param {bool} shouldPlay if true (default), playback will start immediately
 */
export const setPlaying = createAction(
  types.SET_PLAYING,
  (item, shouldPlay = true) => ({ ..._.pick(item, ['type', 'id']), shouldPlay }),
);

/**
 * Clear the item that's currently playing.
 */
export const clearPlayback = createAction(types.CLEAR_PLAYBACK);

/**
 * Store the created Sound for later reference.
 *
 * @param {Expo.Audio.Sound} sound sound returned from Sound.createAsync
 */
export const setSound = createAction(types.SET_SOUND);

/**
 * Start playback.
 */
export const play = createAction(types.PLAY);

/**
 * Pause playback.
 */
export const pause = createAction(types.PAUSE);

/**
 * Jump forward or backward by a number of seconds.
 *
 * @param {number} seconds number of seconds to jump
 *   forward (if >0) or backward (if <0)
 */
export const jump = createAction(types.JUMP);

export const seek = createAction(types.SEEK);
export const setPendingSeek = createAction(types.SET_PENDING_SEEK);

export const setStatus = createAction(types.SET_STATUS);
