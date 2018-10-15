import React from 'react';
import PlayableItemHeader from './PlayableItemHeader';

import appPropTypes from '../propTypes';

const LiturgyItemHeader = ({ liturgyItem, ...props }) => (
  <PlayableItemHeader
    coverImageSource={{
      uri: liturgyItem.imageUrl,
    }}
    title={liturgyItem.title}
    description={liturgyItem.description}
    duration={liturgyItem.duration}
    publishedAt={liturgyItem.publishedAt}
    {...props}
  />
);

LiturgyItemHeader.propTypes = {
  liturgyItem: appPropTypes.liturgyItem.isRequired,
};

export default LiturgyItemHeader;
