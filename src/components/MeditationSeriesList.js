import React from 'react';
import PropTypes from 'prop-types';

import SeriesList from './SeriesList';
import MeditationSeriesTile from './MeditationSeriesTile';
import MeditationCategory from '../state/models/MeditationCategory';

const MeditationSeriesList = ({ meditationCategories, onPressMeditationCategory }) => (
  <SeriesList>
    {meditationCategories.map(meditationCategory => (
      <MeditationSeriesTile
        key={meditationCategory.title}
        meditationCategory={meditationCategory}
        onPress={() => onPressMeditationCategory(meditationCategory)}
      />
    ))}
  </SeriesList>
);

MeditationSeriesList.propTypes = {
  meditationCategories: PropTypes.arrayOf(
    PropTypes.shape(MeditationCategory.propTypes),
  ),
  onPressMeditationCategory: PropTypes.func,
};

MeditationSeriesList.defaultProps = {
  meditationCategories: [],
  onPressMeditationCategory: () => {},
};

export default MeditationSeriesList;
