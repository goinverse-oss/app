import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import SingleMediaItemScreen from './SingleMediaItemScreen';
import PodcastEpisode from '../state/models/PodcastEpisode';
import { podcastEpisodeSelector } from '../state/ducks/orm/selectors';

const SinglePodcastEpisodeScreen = ({ episode }) => (
  <SingleMediaItemScreen item={episode} mediaType="podcasts" />
);

SinglePodcastEpisodeScreen.propTypes = {
  episode: PropTypes.shape(PodcastEpisode.propTypes),
};

SinglePodcastEpisodeScreen.defaultProps = {
  episode: null,
};

function mapStateToProps(state, { route }) {
  const { params: { episode } } = route;
  return {
    episode: podcastEpisodeSelector(state, episode.id),
  };
}

export default connect(mapStateToProps)(SinglePodcastEpisodeScreen);
