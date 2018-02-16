import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  TouchableWithoutFeedback,
  StyleSheet,
  Platform,
} from 'react-native';

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

const Card = ({ children, style, onPress }) => (
  <TouchableWithoutFeedback onPress={onPress}>
    <View style={[styles.container, style]}>
      {children}
    </View>
  </TouchableWithoutFeedback>
);

Card.propTypes = {
  children: PropTypes.node,
  style: View.propTypes.style,
  onPress: PropTypes.func,
};

Card.defaultProps = {
  children: null,
  style: {},
  onPress: () => {},
};

export default Card;
