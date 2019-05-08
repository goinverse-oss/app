import React from 'react';
import PropTypes from 'prop-types';
import PlayableListCard from './PlayableListCard';

import LiturgyItem from '../state/models/LiturgyItem';

const LiturgyItemListCard = ({ item, ...props }) => (
  <PlayableListCard
    item={item}
    formatTitle={({ track, title }) => `${track}. ${title}`}
    formatPublishedAt={() => null}
    renderDescription={({ contributors }) => {
      const separator = ' • ';
      if (contributors) {
        return contributors.map(c => c.name).join(separator);
      }
      return '';
    }}
    {...props}
  />
);

LiturgyItemListCard.propTypes = {
  item: PropTypes.shape(LiturgyItem.propTypes).isRequired,
};

export default LiturgyItemListCard;
