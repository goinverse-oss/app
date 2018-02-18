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

const MeditationSeriesTile = ({ meditationCategory, onPress }) => (
  <SeriesTile
    imageSource={meditationCategory.imageSource}
    title={meditationCategory.title}
    onPress={() => onPress(meditationCategory)}
    description={
      formatMeditationCount(meditationCategory.meditationCount)
    }
  />
);

MeditationSeriesTile.propTypes = {
  meditationCategory: AppPropTypes.meditationCategory.isRequired,
  onPress: PropTypes.func,
};

MeditationSeriesTile.defaultProps = {
  onPress: () => {},
};

export default MeditationSeriesTile;
