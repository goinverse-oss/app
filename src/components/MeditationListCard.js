import React from 'react';
import PlayableListCard from './PlayableListCard';

import appPropTypes from '../propTypes';

const MeditationListCard = ({ meditation, ...props }) => (
  <PlayableListCard
    coverImageSource={{
      uri: meditation.imageUrl,
    }}
    title={meditation.title}
    description={meditation.description}
    duration={meditation.duration}
    publishDate={meditation.publishDate}
    mediaType="meditation"
    {...props}
  />
);

MeditationListCard.propTypes = {
  meditation: appPropTypes.meditation.isRequired,
};

export default MeditationListCard;
