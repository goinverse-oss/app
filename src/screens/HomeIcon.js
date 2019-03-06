import React from 'react';
import PropTypes from 'prop-types';
import Icon from '@expo/vector-icons/Ionicons';

const HomeIcon = ({ tintColor }) => (
  <Icon
    name="md-home"
    style={{
      color: tintColor,
      fontSize: 28,
      height: 32,
    }}
  />
);

HomeIcon.propTypes = {
  tintColor: PropTypes.string.isRequired,
};

export default HomeIcon;
