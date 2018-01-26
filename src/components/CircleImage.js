import React from 'react';
import PropTypes from 'prop-types';

import { View, Image } from 'react-native';

function getStyle({ diameter, shadow }) {
  const shadowStyle = shadow ? {
    shadowColor: '#000',
    shadowOpacity: 0.11,
    shadowOffset: {
      height: diameter * 0.05,
    },
    shadowRadius: diameter * 0.08,
  } : {};

  return {
    width: diameter,
    height: diameter,
    borderRadius: diameter / 2,
    ...shadowStyle,
  };
}

const CircleImage = ({ source, ...props }) => (
  // Note: we set shadow props on a wrapper <View>
  // rather than on the <Image> itself, because of this
  // issue with Image automatically getting `overflow: 'hidden'`
  // https://github.com/facebook/react-native/issues/449
  <View style={[getStyle(props), props.style]} >
    <Image
      source={source}
      style={getStyle(props)}
    />
  </View>
);

CircleImage.propTypes = {
  diameter: PropTypes.number.isRequired,
  source: PropTypes.shape({
    uri: PropTypes.string.isRequired,
  }).isRequired,
  shadow: PropTypes.bool,

  // eslint-disable-next-line react/no-typos
  style: View.propTypes.style,
};

CircleImage.defaultProps = {
  shadow: false,
  style: {},
};

export default CircleImage;
