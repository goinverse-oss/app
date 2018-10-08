import React from 'react';
import PlayableItemHeader from './PlayableItemHeader';

import appPropTypes from '../propTypes';

const MeditationHeader = ({ meditation, ...props }) => (
  <PlayableItemHeader
    coverImageSource={{
      uri: meditation.imageUrl,
    }}
    title={meditation.title}
    description={meditation.description}
    duration={meditation.duration}
    publishedAt={meditation.publishedAt}
    {...props}
  />
);

MeditationHeader.propTypes = {
  meditation: appPropTypes.meditation.isRequired,
};

export default MeditationHeader;
