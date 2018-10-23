import moment from 'moment';
import { handleActions } from '../../utils/reduxActions';

import {
  SET_PLAYING,
  PLAY,
  PAUSE,
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
  [PLAY]: state => ({
    ...state,
    playing: true,
    paused: false,
  }),
  [PAUSE]: state => ({
    ...state,
    paused: true,
  }),
}, defaultState);
