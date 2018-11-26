import React from 'react';
import PlayableListCard from './PlayableListCard';

import appPropTypes from '../propTypes';

const LiturgyItemListCard = ({ liturgyItem, ...props }) => (
  <PlayableListCard
    item={liturgyItem}
    {...props}
  />
);

LiturgyItemListCard.propTypes = {
  liturgyItem: appPropTypes.liturgyItem.isRequired,
};

export default LiturgyItemListCard;
