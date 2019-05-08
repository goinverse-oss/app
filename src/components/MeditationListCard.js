import React from 'react';
import PropTypes from 'prop-types';
import PlayableListCard from './PlayableListCard';

import Meditation from '../state/models/Meditation';

const MeditationListCard = ({ item, ...props }) => (
  <PlayableListCard
    item={item}
    {...props}
  />
);

MeditationListCard.propTypes = {
  item: PropTypes.shape(Meditation.propTypes).isRequired,
};

export default MeditationListCard;
