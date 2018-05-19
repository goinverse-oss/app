import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  ViewPropTypes,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';
import { defaultShadowStyle } from '../styles';

const styles = StyleSheet.create({
  // Tile wrapper base
  container: {
    borderRadius: 4,
    backgroundColor: '#fff',
    ...defaultShadowStyle,
  },
});

const Card = ({ children, style, onPress }) => (
  <TouchableWithoutFeedback onPress={onPress}>
    <View style={[styles.container, style]}>
      {children}
    </View>
  </TouchableWithoutFeedback>
);

Card.propTypes = {
  children: PropTypes.node,
  style: ViewPropTypes.style,
  onPress: PropTypes.func,
};

Card.defaultProps = {
  children: null,
  style: {},
  onPress: () => {},
};

export default Card;
