import React from 'react';
import PropTypes from 'prop-types';

import { Image } from 'react-native';

function getStyle({ diameter, shadow }) {
  const shadowStyle = shadow ? {
    shadowColor: '#000',
    shadowOpacity: 0.91,
    shadowOffset: {
      width: 10,
      height: 10,
    },
    shadowRadius: 10,
  } : {};

  return {
    width: diameter,
    height: diameter,
    borderRadius: diameter / 2,
    ...shadowStyle,
  };
}

const CircleImage = ({ source, ...props }) => (
  <Image source={source} style={getStyle(props)} />
);

CircleImage.propTypes = {
  diameter: PropTypes.number.isRequired,
  source: PropTypes.shape({
    uri: PropTypes.string.isRequired,
  }).isRequired,
  shadow: PropTypes.bool,
};

CircleImage.defaultProps = {
  shadow: false,
};

export default CircleImage;
