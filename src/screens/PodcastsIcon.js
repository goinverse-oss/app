import React from 'react';
import PropTypes from 'prop-types';

import Icon from '@expo/vector-icons/Entypo';

const PodcastsIcon = ({ tintColor }) => (
  <Icon
    name="rss"
    style={{
      color: tintColor,
      fontSize: 32,
    }}
  />
);

PodcastsIcon.propTypes = {
  tintColor: PropTypes.string.isRequired,
};

export default PodcastsIcon;
