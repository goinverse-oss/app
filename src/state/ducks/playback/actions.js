import { createAction } from 'redux-actions';

import * as types from './types';

export const setPlaying = createAction(types.SET_PLAYING);
export const play = createAction(types.PLAY);
export const pause = createAction(types.PAUSE);
