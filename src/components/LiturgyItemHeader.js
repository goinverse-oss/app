import React from 'react';
import PlayableItemHeader from './PlayableItemHeader';

import appPropTypes from '../propTypes';

const LiturgyItemHeader = ({ liturgyItem, ...props }) => (
  <PlayableItemHeader item={liturgyItem} {...props} />
);

LiturgyItemHeader.propTypes = {
  liturgyItem: appPropTypes.liturgyItem.isRequired,
};

export default LiturgyItemHeader;
