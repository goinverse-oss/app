import React from 'react';
import PropTypes from 'prop-types';
import { View, ViewPropTypes, Image } from 'react-native';

import AppPropTypes from '../propTypes';

function getStyle({ diameter, shadow }) {
  const shadowStyle = shadow ? {
    // Note: these ratios have not been exhaustively tested.
    // They matched the mockup approximately for one use case.

    // These properties only apply on iOS
    shadowColor: '#000',
    backgroundColor: '#000',
    shadowOpacity: 0.11,
    shadowOffset: {
      height: diameter * 0.05,
    },
    shadowRadius: diameter * 0.08,

    // This property only applies on Android
    elevation: diameter * 0.25,
  } : {};

  return {
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
      style={{
        width: props.diameter,
        height: props.diameter,
        borderRadius: props.diameter / 2,
      }}
    />
  </View>
);

CircleImage.propTypes = {
  diameter: PropTypes.number.isRequired,
  source: AppPropTypes.imageSource.isRequired,
  shadow: PropTypes.bool,

  // eslint-disable-next-line react/no-typos
  style: ViewPropTypes.style,
};

CircleImage.defaultProps = {
  shadow: false,
  style: {},
};

export default CircleImage;
