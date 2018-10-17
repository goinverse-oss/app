import React from 'react';
import PropTypes from 'prop-types';
import PlayableItemHeader from './PlayableItemHeader';

import Meditation from '../state/models/Meditation';

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
  meditation: PropTypes.shape(Meditation.propTypes).isRequired,
};

export default MeditationHeader;
