import React from 'react';
import PropTypes from 'prop-types';

import SeriesList from './SeriesList';
import PodcastSeriesTile from './PodcastSeriesTile';
import Podcast from '../state/models/Podcast';

const PodcastSeriesList = ({ podcasts, onPressPodcast }) => (
  <SeriesList>
    {podcasts.map(podcast => (
      <PodcastSeriesTile
        key={podcast.title}
        podcast={podcast}
        onPress={() => onPressPodcast(podcast)}
      />
    ))}
  </SeriesList>
);

PodcastSeriesList.propTypes = {
  podcasts: PropTypes.arrayOf(
    PropTypes.shape(
      Podcast.propTypes,
    ),
  ),
  onPressPodcast: PropTypes.func,
};

PodcastSeriesList.defaultProps = {
  podcasts: [],
  onPressPodcast: () => {},
};

export default PodcastSeriesList;
