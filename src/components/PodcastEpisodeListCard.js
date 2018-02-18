import React from 'react';
import PlayableListCard from './PlayableListCard';

import appPropTypes from '../propTypes';

const PodcastEpisodeListCard = ({ podcastEpisode, ...props }) => (
  <PlayableListCard
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

PodcastEpisodeListCard.propTypes = {
  podcastEpisode: appPropTypes.podcastEpisode.isRequired,
};

export default PodcastEpisodeListCard;
