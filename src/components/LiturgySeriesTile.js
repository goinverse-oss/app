import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import moment from 'moment';

import SeriesTile from './SeriesTile';
import Liturgy from '../state/models/Liturgy';
import { getImageSource } from '../state/ducks/orm/utils';

export const formatLiturgyDescription = (liturgy) => {
  const liturgyLength = liturgy.items.reduce(
    (duration, item) => duration.add(moment.duration(item.duration)),
    moment.duration(),
  );
  const { publishedAt } = liturgy;

  const separator = ' • ';
  const strings = [];
  if (!_.isNull(liturgyLength)) {
    const minutes = Math.ceil(liturgyLength.asMinutes());
    strings.push(`${minutes} min`);
  }
  if (!_.isNull(publishedAt)) {
    strings.push(moment(publishedAt).format('YYYY'));
  }
  return strings.join(separator);
};

const LiturgySeriesTile = ({ liturgy, onPress }) => (
  <SeriesTile
    imageSource={getImageSource(liturgy)}
    title={liturgy.title}
    onPress={() => onPress(liturgy)}
    description={formatLiturgyDescription(liturgy)}
  />
);

LiturgySeriesTile.propTypes = {
  liturgy: PropTypes.shape(Liturgy.propTypes).isRequired,
  onPress: PropTypes.func,
};

LiturgySeriesTile.defaultProps = {
  onPress: () => {},
};

export default LiturgySeriesTile;
