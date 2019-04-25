import React from 'react';
import PlayableItemHeader from './PlayableItemHeader';

import appPropTypes from '../propTypes';

const PodcastEpisodeHeader = ({ podcastEpisode, ...props }) => (
  <PlayableItemHeader item={podcastEpisode} {...props} />
);

PodcastEpisodeHeader.propTypes = {
  podcastEpisode: appPropTypes.podcastEpisode.isRequired,
};

export default PodcastEpisodeHeader;
