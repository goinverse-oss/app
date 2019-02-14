import React from 'react';
import PropTypes from 'prop-types';
import PlayableListCard from './PlayableListCard';

import Meditation from '../state/models/Meditation';

const MeditationListCard = ({ meditation, ...props }) => (
  <PlayableListCard
    item={meditation}
    {...props}
  />
);

MeditationListCard.propTypes = {
  meditation: PropTypes.shape(Meditation.propTypes).isRequired,
};

export default MeditationListCard;
