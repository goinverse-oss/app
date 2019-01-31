import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import SingleMediaItemScreen from './SingleMediaItemScreen';
import { getCommonNavigationOptions } from '../navigation/common';
import BackButton from '../navigation/BackButton';
import PodcastEpisode from '../state/models/PodcastEpisode';
import { podcastEpisodeSelector } from '../state/ducks/orm/selectors';

const SinglePodcastEpisodeScreen = ({ episode }) => (
  <SingleMediaItemScreen item={episode} mediaType="podcasts" />
);

SinglePodcastEpisodeScreen.propTypes = {
  episode: PropTypes.shape(PodcastEpisode.propTypes).isRequired,
};

function mapStateToProps(state, { navigation }) {
  const { state: { params: { episode } } } = navigation;
  return {
    episode: podcastEpisodeSelector(state, episode.id),
  };
}

SinglePodcastEpisodeScreen.navigationOptions = ({ screenProps }) => ({
  ...getCommonNavigationOptions(screenProps.drawer),
  headerLeft: <BackButton />,
  title: 'Podcasts',
});

export default connect(mapStateToProps)(SinglePodcastEpisodeScreen);
