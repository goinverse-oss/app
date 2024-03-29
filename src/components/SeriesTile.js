import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, Platform, TouchableWithoutFeedback, ViewPropTypes } from 'react-native';
import { normalize } from 'react-native-elements';
import fonts from 'react-native-elements/src/config/fonts';
import colors from '../styles/colors';
import SquareImage from './SquareImage';

import appPropTypes from '../propTypes';
import { screenRelativeWidth } from './utils';


const cardWidthFraction = 0.45;
const padding = 9;
const imageMargin = 6;
const borderRadius = 4;

// using the width of the container, adjusted for padding, margin, and border radius
const imageWidth = (
  screenRelativeWidth(cardWidthFraction)
  - padding
  - imageMargin
  - borderRadius
);

const cardSpaceWidthFraction = (1.0 - (cardWidthFraction * 2)) / 3;

// export so that SeriesList can use it too
export const cardMargin = screenRelativeWidth(cardSpaceWidthFraction / 2);

const styles = StyleSheet.create({
  container: {
    padding,
    width: screenRelativeWidth(cardWidthFraction),
    margin: cardMargin,
    borderRadius,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    ...Platform.select({
      ios: {
        shadowColor: colors.black,
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  imageContainer: {
    flex: 1,
    width: null,
    height: imageWidth,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    width: '95%',
  },
  title: {
    fontSize: normalize(12),
    color: colors.black,
    lineHeight: 20,
    paddingTop: 14.5,
    paddingBottom: 5,
    ...Platform.select({
      ios: {
        fontWeight: '700',
      },
      android: {
        ...fonts.android.medium,
      },
    }),
  },
  description: {
    fontSize: normalize(10),
    fontWeight: 'normal',
    color: colors.secondaryText,
    lineHeight: 16,
  },
});

const SeriesTile = ({
  onPress, imageSource, title, description, style,
}) => (
  <TouchableWithoutFeedback onPress={onPress}>
    <View style={[styles.container, style]}>
      <View style={styles.imageContainer}>
        <SquareImage
          source={imageSource}
          width={imageWidth}
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        <Text style={styles.description} numberOfLines={1}>{description}</Text>
      </View>
    </View>
  </TouchableWithoutFeedback>
);

SeriesTile.propTypes = {
  imageSource: appPropTypes.imageSource,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  onPress: PropTypes.func,
  style: ViewPropTypes.style,
};

SeriesTile.defaultProps = {
  imageSource: undefined,
  onPress: () => {},
  style: {},
};

export default SeriesTile;
