import React from 'react';
import PlayableListCard from './PlayableListCard';

import appPropTypes from '../propTypes';

const MeditationListCard = ({ meditation, ...props }) => (
  <PlayableListCard
    item={meditation}
    {...props}
  />
);

MeditationListCard.propTypes = {
  meditation: appPropTypes.meditation.isRequired,
};

export default MeditationListCard;
