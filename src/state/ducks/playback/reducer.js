import _ from 'lodash';
import { persistReducer, createTransform } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // AsyncStorage for react-native

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

export const playbackTransforms = [
  createTransform(
    () => null, // clear sound
    outboundState => outboundState,
    { whitelist: ['sound'] },
  ),
  createTransform(
    () => false, // pause playback
    outboundState => outboundState,
    { whitelist: ['playing'] },
  ),
  createTransform(
    () => true, // pause playback
    outboundState => outboundState,
    { whitelist: ['paused'] },
  ),
];

const persistConfig = {
  key: 'playback',
  storage,
  transforms: playbackTransforms,
};

function storePodcastEpisodePlaybackStatus(playbackStatusPerItem, item, status) {
  if (item.type !== 'podcastEpisode') {
    return playbackStatusPerItem;
  }

  return {
    ...playbackStatusPerItem,
    [item.id]: {
      ..._.get(playbackStatusPerItem, item.id, {}),
      status,
    },
  };
}

function setInitialStatus(state, item) {
  const { id } = item;
  const status = _.get(state.playbackStatusPerItem, id);
  return status ? { status } : {};
}

export default persistReducer(
  persistConfig,
  handleActions({
    [SET_PLAYING]: (state, action) => ({
      ...state,
      item: action.payload,
      playing: true,
      paused: false,
      ...setInitialStatus(state, action.payload),
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
      status: {
        ...state.status,
        ...action.payload,
      },
      playbackStatusPerItem: storePodcastEpisodePlaybackStatus(
        state.playbackStatusPerItem,
        state.item,
        action.payload,
      ),
      item: action.payload.didJustFinish ? null : state.item,
    }),
    [SET_PENDING_SEEK]: (state, action) => ({
      ...state,
      pendingSeekDestination: action.payload,
    }),
  }, defaultState),
);
