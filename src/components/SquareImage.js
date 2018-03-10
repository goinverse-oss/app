import React from 'react';
import PropTypes from 'prop-types';
import { View, Image } from 'react-native';

import AppPropTypes from '../propTypes';

const styles = {
  image: {
    flex: 1,
    aspectRatio: 1,
    resizeMode: 'cover',
    borderRadius: 4,
  },
};

const SquareImage = ({ source, width, style }) => (
  <Image
    source={source}
    style={[
      styles.image,
      { width, height: width },
      style,
    ]}
  />
);

SquareImage.propTypes = {
  width: PropTypes.number.isRequired,
  source: AppPropTypes.imageSource.isRequired,
  style: View.propTypes.style,
};

SquareImage.defaultProps = {
  style: {},
};

export default SquareImage;
