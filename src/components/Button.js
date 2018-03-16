import React from 'react';
import PropTypes from 'prop-types';
import {
  ViewPropTypes,
  StyleSheet,
} from 'react-native';

import Card from './Card';

const styles = StyleSheet.create({
  // Tile wrapper base
  container: {
    flex: 0,
    alignSelf: 'flex-start',
    paddingHorizontal: 30,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

const Button = ({ children, style, onPress }) => (
  <Card style={[styles.container, style]} onPress={onPress}>
    {children}
  </Card>
);

Button.propTypes = {
  children: PropTypes.node,
  style: ViewPropTypes.style,
  onPress: PropTypes.func,
};

Button.defaultProps = {
  children: null,
  style: {},
  onPress: () => {},
};

export default Button;
