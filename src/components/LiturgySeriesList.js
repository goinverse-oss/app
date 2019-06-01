import React from 'react';
import PropTypes from 'prop-types';

import SeriesList from './SeriesList';
import LiturgySeriesTile from './LiturgySeriesTile';
import Liturgy from '../state/models/Liturgy';

const LiturgySeriesList = ({ liturgies, onPressLiturgy }) => (
  <SeriesList>
    {liturgies.map(liturgy => (
      <LiturgySeriesTile
        key={liturgy.title}
        liturgy={liturgy}
        onPress={() => onPressLiturgy(liturgy)}
      />
    ))}
  </SeriesList>
);

LiturgySeriesList.propTypes = {
  liturgies: PropTypes.arrayOf(
    PropTypes.shape(Liturgy.propTypes),
  ),
  onPressLiturgy: PropTypes.func,
};

LiturgySeriesList.defaultProps = {
  liturgies: [],
  onPressLiturgy: () => {},
};

export default LiturgySeriesList;
