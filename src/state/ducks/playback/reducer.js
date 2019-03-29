import moment from 'moment';

import { handleActions } from '../../utils/reduxActions';

import {
  SET_PLAYING,
  SET_SOUND,
  PLAY,
  PAUSE,
  SET_STATUS,
  SET_PENDING_SEEK,
} from './types';

/* playback reducer state shape:
{
  // current item playing, if any
  item: PodcastEpisode|Meditation,

  // true iff something has started playback
  playing: boolean,

  // true iff playback is paused
  paused: boolean,

  // time elapsed in playback
  elapsed: moment.Duration,

  // playing sound object
  sound: Expo.Audio.Sound,

  // status of playing item
  status: Expo.Audio.Sound.status,
}
*/

const defaultState = {
  item: null,
  playing: false,
  paused: false,
  elapsed: moment.duration(),
  sound: null,
  status: null,
};

// define here alongside state; used at top level
export const playbackTransform = [
  inboundState => ({
    ...inboundState,
    playing: false,
    sound: null,
    paused: true,
    elapsed: inboundState.elapsed.toString(),
  }),
  outboundState => ({
    ...outboundState,
    elapsed: moment.duration(outboundState.elapsed),
  }),
];

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
    item: action.payload.didJustFinish ? null : state.item,
  }),
  [SET_PENDING_SEEK]: (state, action) => ({
    ...state,
    pendingSeekDestination: action.payload,
  }),
}, defaultState);
