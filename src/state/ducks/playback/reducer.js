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
  }),
  outboundState => outboundState,
];

function storePodcastEpisodePlaybackStatus(item, status) {
  if (item.type !== 'podcastEpisode') {
    return {};
  }

  return {
    [item.id]: status,
  };
}

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
    playbackStatusPerItem: {
      ...state.playbackStatusPerItem,
      ...storePodcastEpisodePlaybackStatus(state.item, action.payload),
    },
    item: action.payload.didJustFinish ? null : state.item,
  }),
  [SET_PENDING_SEEK]: (state, action) => ({
    ...state,
    pendingSeekDestination: action.payload,
  }),
}, defaultState);
