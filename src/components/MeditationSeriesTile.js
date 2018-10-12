import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import SeriesTile from './SeriesTile';
import MeditationCategory from '../state/models/MeditationCategory';

const formatMeditationCount = (meditationCount) => {
  let meditationString = 'Meditations';
  if (meditationCount === 1) {
    meditationString = 'Meditation';
  }
  return `${meditationCount} ${meditationString}`;
};

const MeditationSeriesTile = ({ meditationCategory, onPress }) => (
  <SeriesTile
    imageUrl={meditationCategory.imageUrl}
    title={meditationCategory.title}
    onPress={() => onPress(meditationCategory)}
    description={
      formatMeditationCount(_.get(meditationCategory, 'meditations.length', 0))
    }
  />
);

MeditationSeriesTile.propTypes = {
  meditationCategory: PropTypes.shape(
    MeditationCategory.propTypes,
  ).isRequired,
  onPress: PropTypes.func,
};

MeditationSeriesTile.defaultProps = {
  onPress: () => {},
};

export default MeditationSeriesTile;
