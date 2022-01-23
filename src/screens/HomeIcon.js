import React from 'react';
import PropTypes from 'prop-types';
import Icon from '@expo/vector-icons/Ionicons';

const HomeIcon = ({ color }) => (
  <Icon
    name="md-home"
    style={{
      color,
      fontSize: 28,
      height: 32,
    }}
  />
);

HomeIcon.propTypes = {
  color: PropTypes.string.isRequired,
};

export default HomeIcon;
