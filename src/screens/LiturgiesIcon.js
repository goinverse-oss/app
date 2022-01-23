import React from 'react';
import PropTypes from 'prop-types';

import Icon from '@expo/vector-icons/Ionicons';

const LiturgiesIcon = ({ color }) => (
  <Icon
    name="ios-musical-notes"
    style={{
      color,
      fontSize: 24,
      height: 32,
    }}
  />
);

LiturgiesIcon.propTypes = {
  color: PropTypes.string.isRequired,
};

export default LiturgiesIcon;
