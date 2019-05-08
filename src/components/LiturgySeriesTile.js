import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import moment from 'moment';

import SeriesTile from './SeriesTile';
import Liturgy from '../state/models/Liturgy';
import { getImageSource } from '../state/ducks/orm/utils';

const formatLiturgyDescription = (liturgyLength, publishedDate) => {
  const separator = ' • ';
  const strings = [];
  if (!_.isNull(liturgyLength)) {
    const minutes = Math.ceil(liturgyLength.asMinutes());
    strings.push(`${minutes} min`);
  }
  if (!_.isNull(publishedDate)) {
    strings.push(moment(publishedDate).format('YYYY'));
  }
  return strings.join(separator);
};
const LiturgySeriesTile = ({ liturgy, onPress }) => (
  <SeriesTile
    imageSource={getImageSource(liturgy)}
    title={liturgy.title}
    onPress={() => onPress(liturgy)}
    description={
      formatLiturgyDescription(
        liturgy.items.reduce(
          (duration, item) => duration.add(moment.duration(item.duration)),
          moment.duration(),
        ),
        liturgy.publishedAt,
      )
    }
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
