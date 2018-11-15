import moment from 'moment';
import { handleActions } from '../../utils/reduxActions';

import {
  SET_PLAYING,
  SET_SOUND,
  PLAY,
  PAUSE,
  SET_STATUS,
} from './types';

/* playback reducer state shape:
{
  // current item playing, if any
  item: Meditation,

  // true iff something has started playback
  playing: boolean,

  // true iff playback is paused
  paused: boolean,

  // status of playing item
  status: Expo.Audio.Sound.status,
}
*/

const defaultState = {
  item: null,
  playing: false,
  paused: false,
  elapsed: moment.duration(),
};

export default handleActions({
  [SET_PLAYING]: (state, action) => ({
    ...state,
    item: action.payload,
    playing: true,
    paused: false,
  }),
  [SET_SOUND]: (state, action) => ({
    ...state,
    sound: action.payload,
  }),
  [PLAY]: state => ({
    ...state,
    playing: true,
    paused: false,
  }),
  [PAUSE]: state => ({
    ...state,
    paused: true,
  }),
  [SET_STATUS]: (state, action) => ({
    ...state,
    status: action.payload,
  }),
}, defaultState);