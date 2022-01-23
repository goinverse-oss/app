import React from 'react';
import PropTypes from 'prop-types';

import Icon from '@expo/vector-icons/Ionicons';

const MeditationsIcon = ({ color }) => (
  <Icon
    name="md-sunny"
    style={{
      color,
      fontSize: 24,
      height: 32,
    }}
  />
);

MeditationsIcon.propTypes = {
  color: PropTypes.string.isRequired,
};

export default MeditationsIcon;
