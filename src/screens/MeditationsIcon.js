import React from 'react';
import PropTypes from 'prop-types';

import Icon from '@expo/vector-icons/Ionicons';

const MeditationsIcon = ({ tintColor }) => (
  <Icon
    name="md-sunny"
    style={{
      color: tintColor,
      fontSize: 24,
      height: 32,
    }}
  />
);

MeditationsIcon.propTypes = {
  tintColor: PropTypes.string.isRequired,
};

export default MeditationsIcon;
