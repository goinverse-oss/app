import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';

import SeriesTile from './SeriesTile';
import MeditationCategory from '../state/models/MeditationCategory';
import Meditation from '../state/models/Meditation';
import { getImageSource } from '../state/ducks/orm/utils';
import { meditationsSelector } from '../state/ducks/orm/selectors';

const formatMeditationCount = (category, meditations) => {
  const meditationCount = (category.title === 'All Meditations'
    ? meditations.length
    : _.get(category, 'meditations.length', 0)
  );
  let meditationString = 'Meditations';
  if (meditationCount === 1) {
    meditationString = 'Meditation';
  }
  return `${meditationCount} ${meditationString}`;
};

const MeditationSeriesTile = ({ meditationCategory, onPress, meditations }) => (
  <SeriesTile
    imageSource={getImageSource(meditationCategory)}
    title={meditationCategory.title}
    onPress={() => onPress(meditationCategory)}
    description={
      formatMeditationCount(meditationCategory, meditations)
    }
  />
);

MeditationSeriesTile.propTypes = {
  meditationCategory: PropTypes.shape(
    MeditationCategory.propTypes,
  ).isRequired,
  onPress: PropTypes.func,
  meditations: PropTypes.arrayOf(
    PropTypes.shape(Meditation.propTypes),
  ).isRequired,
};

MeditationSeriesTile.defaultProps = {
  onPress: () => {},
};

function mapStateToProps(state) {
  return {
    meditations: meditationsSelector(state),
  };
}

export default connect(mapStateToProps)(MeditationSeriesTile);
