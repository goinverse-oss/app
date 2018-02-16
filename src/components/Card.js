import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Platform } from 'react-native';

const styles = StyleSheet.create({
  // Tile wrapper base
  container: {
    borderRadius: 4,
    backgroundColor: '#fff',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
  },
});

const Card = ({ children, style }) => (
  <View style={[styles.container, style]}>
    {children}
  </View>
);

Card.propTypes = {
  children: PropTypes.node,
  style: View.propTypes.style,
};

Card.defaultProps = {
  children: null,
  style: {},
};

export default Card;
