import React from 'react';
import PropTypes from 'prop-types';

import { ViewPropTypes, Text, StyleSheet, Platform } from 'react-native';
import Icon from '@expo/vector-icons/Foundation';
import { normalize } from 'react-native-elements';
import fonts from 'react-native-elements/src/config/fonts';

import Button from './Button';

const styles = StyleSheet.create({
  container: {

  },
  buttonText: {
    fontSize: normalize(13),
    color: '#797979',
    ...Platform.select({
      ios: {
        fontWeight: '600',
      },
      android: {
        ...fonts.android.medium,
      },
    }),
  },
  playIcon: {
    fontSize: 18,
    color: '#797979',
    marginRight: 5,
  },
});

const PlayButton = ({ text, style, ...props }) => (
  <Button style={[styles.container, style]} {...props} >
    <Icon name="play" style={styles.playIcon} />
    <Text style={styles.buttonText}>{text}</Text>
  </Button>
);

PlayButton.propTypes = {
  text: PropTypes.string,
  style: ViewPropTypes.style,
  // passthrough props:
  // - onPress
};

PlayButton.defaultProps = {
  text: '',
  style: {},
};

export default PlayButton;
