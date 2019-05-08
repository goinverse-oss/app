import React from 'react';
import PropTypes from 'prop-types';

import Icon from '@expo/vector-icons/Ionicons';

const LiturgiesIcon = ({ tintColor }) => (
  <Icon
    name="ios-musical-notes"
    style={{
      color: tintColor,
      fontSize: 24,
      height: 32,
    }}
  />
);

LiturgiesIcon.propTypes = {
  tintColor: PropTypes.string.isRequired,
};

export default LiturgiesIcon;
