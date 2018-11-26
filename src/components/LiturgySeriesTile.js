import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import AppPropTypes from '../propTypes';

import SeriesTile from './SeriesTile';

const formatLiturgyDescription = (liturgyLength, publishedDate) => {
  const separator = ' • ';
  const strings = [];
  if (!_.isNull(liturgyLength)) {
    strings.push(`${liturgyLength} min`);
  }
  if (!_.isNull(publishedDate)) {
    strings.push(publishedDate.format('YYYY'));
  }
  return strings.join(separator);
};
const LiturgySeriesTile = ({ liturgy, onPress }) => (
  <SeriesTile
    imageUrl={liturgy.imageUrl}
    title={liturgy.title}
    onPress={() => onPress(liturgy)}
    description={formatLiturgyDescription(liturgy.liturgyLength, liturgy.publishedDate)}
  />
);

LiturgySeriesTile.propTypes = {
  liturgy: AppPropTypes.liturgy.isRequired,
  onPress: PropTypes.func,
};

LiturgySeriesTile.defaultProps = {
  onPress: () => {},
};

export default LiturgySeriesTile;
