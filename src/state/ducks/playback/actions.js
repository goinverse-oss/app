import { createAction } from 'redux-actions';

import * as types from './types';

export const setPlaying = createAction(types.SET_PLAYING);
export const setSound = createAction(types.SET_SOUND);
export const play = createAction(types.PLAY);
export const pause = createAction(types.PAUSE);

/**
 * Jump forward or backward by a number of seconds.
 *
 * @param {number} seconds number of seconds to jump
 *   forward (if >0) or backward (if <0)
 */
export const jump = createAction(types.JUMP);

export const setStatus = createAction(types.SET_STATUS);
