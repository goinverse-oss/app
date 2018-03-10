import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import AppPropTypes from '../propTypes';

import SeriesTile from './SeriesTile';

const formatEpisodeCount = (episodeCount) => {
  let episodeString = 'Episodes';
  if (episodeCount === 1) {
    episodeString = 'Episode';
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
    strings.push(lastUpdated.fromNow());
  }
  return strings.join(separator);
};

const PodcastSeriesTile = ({ podcast, onPress }) => (
  <SeriesTile
    imageSource={podcast.imageSource}
    title={podcast.title}
    onPress={() => onPress(podcast)}
    description={formatPodcastDescription(podcast.episodeCount, podcast.lastUpdated)}
  />
);

PodcastSeriesTile.propTypes = {
  podcast: AppPropTypes.podcast.isRequired,
  onPress: PropTypes.func,
};

PodcastSeriesTile.defaultProps = {
  onPress: () => {},
};

export default PodcastSeriesTile;
