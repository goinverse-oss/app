import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import moment from 'moment';

import SeriesTile from './SeriesTile';
import Podcast from '../state/models/Podcast';

const formatEpisodeCount = (episodeCount) => {
  let episodeString = 'episodes';
  if (episodeCount === 1) {
    episodeString = 'episode';
  }
  return `${episodeCount} ${episodeString}`;
};

const formatPodcastDescription = (episodeCount, lastUpdated) => {
  const separator = ' • ';
  const strings = [];
  if (!_.isNull(episodeCount)) {
    strings.push(formatEpisodeCount(episodeCount));
  }
  if (!_.isNull(lastUpdated)) {
    strings.push(moment(lastUpdated).fromNow());
  }
  return strings.join(separator);
};

const PodcastSeriesTile = ({ podcast, onPress }) => (
  <SeriesTile
    imageUrl={podcast.imageUrl}
    title={podcast.title}
    onPress={() => onPress(podcast)}
    description={formatPodcastDescription(podcast.episodes.length, podcast.updatedAt)}
  />
);

PodcastSeriesTile.propTypes = {
  podcast: PropTypes.shape(
    Podcast.propTypes,
  ).isRequired,
  onPress: PropTypes.func,
};

PodcastSeriesTile.defaultProps = {
  onPress: () => {},
};

export default PodcastSeriesTile;
