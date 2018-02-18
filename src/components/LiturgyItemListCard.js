import React from 'react';
import PlayableListCard from './PlayableListCard';

import appPropTypes from '../propTypes';

const LiturgyItemListCard = ({ liturgyItem, ...props }) => (
  <PlayableListCard
    coverImageSource={{
      uri: liturgyItem.imageUrl,
    }}
    title={liturgyItem.title}
    description={liturgyItem.description}
    duration={liturgyItem.duration}
    publishDate={liturgyItem.publishDate}
    mediaType="liturgy"
    {...props}
  />
);

LiturgyItemListCard.propTypes = {
  liturgyItem: appPropTypes.liturgyItem.isRequired,
};

export default LiturgyItemListCard;
