import React from 'react';
import PlayableListCard from './PlayableListCard';

import appPropTypes from '../propTypes';

const PodcastEpisodeListCard = ({ podcastEpisode, ...props }) => (
  <PlayableListCard
    item={podcastEpisode}
    {...props}
  />
);

PodcastEpisodeListCard.propTypes = {
  podcastEpisode: appPropTypes.podcastEpisode.isRequired,
};

export default PodcastEpisodeListCard;
