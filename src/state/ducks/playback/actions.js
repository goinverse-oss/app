import { createAction } from 'redux-actions';

import * as types from './types';

export const setPlaying = createAction(types.SET_PLAYING);
export const setSound = createAction(types.SET_SOUND);
export const play = createAction(types.PLAY);
export const pause = createAction(types.PAUSE);

export const setStatus = createAction(types.SET_STATUS);
