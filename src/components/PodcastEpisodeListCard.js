import React from 'react';
import PropTypes from 'prop-types';
import PlayableListCard from './PlayableListCard';

import PodcastEpisode from '../state/models/PodcastEpisode';

const PodcastEpisodeListCard = ({ episode, ...props }) => (
  <PlayableListCard
    item={episode}
    {...props}
  />
);

PodcastEpisodeListCard.propTypes = {
  episode: PropTypes.shape(
    PodcastEpisode.propTypes,
  ).isRequired,
};

export default PodcastEpisodeListCard;
