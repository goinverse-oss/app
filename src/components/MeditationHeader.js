import React from 'react';
import PropTypes from 'prop-types';
import PlayableItemHeader from './PlayableItemHeader';

import Meditation from '../state/models/Meditation';

const MeditationHeader = ({ meditation, ...props }) => (
  <PlayableItemHeader item={meditation} {...props} />
);

MeditationHeader.propTypes = {
  meditation: PropTypes.shape(Meditation.propTypes).isRequired,
};

export default MeditationHeader;
