import moment from 'moment';
import { handleActions } from '../../utils/reduxActions';

import {
  SET_PLAYING,
  SET_SOUND,
  PLAY,
  PAUSE,
  SET_ELAPSED,
} from './types';

/* playback reducer state shape:
{
  // current item playing, if any
  item: Meditation,

  // true iff something has started playback
  playing: boolean,

  // true iff playback is paused
  paused: boolean,

  // elapsed duration of playing item
  elapsed: moment.duration,
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
  [SET_ELAPSED]: (state, action) => ({
    ...state,
    elapsed: action.payload,
  }),
}, defaultState);
