import React from 'react';
import PropTypes from 'prop-types';

import Icon from '@expo/vector-icons/Entypo';

const PodcastsIcon = ({ color }) => (
  <Icon
    name="rss"
    style={{
      color,
      fontSize: 24,
      height: 30,
    }}
  />
);

PodcastsIcon.propTypes = {
  color: PropTypes.string.isRequired,
};

export default PodcastsIcon;
