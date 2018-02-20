import React from 'react';
import PlayableItemHeader from './PlayableItemHeader';

import appPropTypes from '../propTypes';

const PodcastEpisodeHeader = ({ podcastEpisode, ...props }) => (
  <PlayableItemHeader
    coverImageSource={{
      uri: podcastEpisode.imageUrl,
    }}
    title={podcastEpisode.title}
    description={podcastEpisode.description}
    duration={podcastEpisode.duration}
    publishDate={podcastEpisode.publishDate}
    mediaType="podcast"
    {...props}
  />
);

PodcastEpisodeHeader.propTypes = {
  podcastEpisode: appPropTypes.podcastEpisode.isRequired,
};

export default PodcastEpisodeHeader;
