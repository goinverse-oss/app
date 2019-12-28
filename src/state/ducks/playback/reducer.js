import _ from 'lodash';
import { persistReducer, createTransform } from 'redux-persist';
import { AsyncStorage } from 'react-native';

import { handleActions } from '../../utils/reduxActions';

import {
  SET_PLAYING,
  CLEAR_PLAYBACK,
  SET_SOUND,
  PLAY,
  PAUSE,
  SET_STATUS,
  SET_PENDING_SEEK,
} from './types';

/* playback reducer state shape:
{
  // current item playing, if any
  item: PodcastEpisode|Meditation|LiturgyItem,

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
    () => true, // pause playback
    outboundState => outboundState,
    { whitelist: ['paused'] },
  ),
];

const persistConfig = {
  key: 'playback',
  storage: AsyncStorage,
  transforms: playbackTransforms,
};

function storePodcastEpisodePlaybackStatus(playbackStatusPerItem, item, status) {
  if (!item || item.type !== 'podcastEpisode') {
    return playbackStatusPerItem;
  }

  if (status.didJustFinish || status.positionMillis === status.durationMillis) {
    return _.omit(playbackStatusPerItem, item.id);
  }

  return {
    ...playbackStatusPerItem,
    [item.id]: {
      ..._.get(playbackStatusPerItem, item.id, {}),
      ...status,
    },
  };
}

export default persistReducer(
  persistConfig,
  handleActions({
    [SET_PLAYING]: (state, action) => ({
      ...state,
      item: _.pick(action.payload, ['type', 'id']),
      paused: !_.get(action.payload, 'shouldPlay', true),
    }),
    [SET_SOUND]: (state, action) => ({
      ...state,
      sound: action.payload,
    }),
    [PLAY]: state => ({
      ...state,
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
    }),
    [CLEAR_PLAYBACK]: state => _.omit(state, 'item'),
    [SET_PENDING_SEEK]: (state, action) => ({
      ...state,
      pendingSeekDestination: action.payload,
    }),
  }, defaultState),
);
