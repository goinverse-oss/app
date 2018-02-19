import React from 'react';
import PropTypes from 'prop-types';
import AppPropTypes from '../propTypes';

import SeriesTile from './SeriesTile';

const formatMeditationCount = (meditationCount) => {
  let meditationString = 'Meditations';
  if (meditationCount === 1) {
    meditationString = 'Meditation';
  }
  return `${meditationCount} ${meditationString}`;
};

const MeditationSeriesTile = ({ meditation, onPress }) => (
  <SeriesTile
    imageSource={meditation.imageSource}
    title={meditation.title}
    onPress={() => onPress(meditation)}
    description={
      formatMeditationCount(meditation.meditationCount)
    }
  />
);

MeditationSeriesTile.propTypes = {
  meditation: AppPropTypes.meditation.isRequired,
  onPress: PropTypes.func,
};

MeditationSeriesTile.defaultProps = {
  onPress: () => {},
};

export default MeditationSeriesTile;
