import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#D2D2D2',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 10,
  },
});

const TextPill = ({ style, children }) => (
  <View style={[styles.container, style]}>
    <Text style={styles.text}>
      {children.toUpperCase()}
    </Text>
  </View>
);

TextPill.propTypes = {
  children: PropTypes.string.isRequired,

  // eslint-disable-next-line react/no-typos
  style: View.propTypes.style,
};

TextPill.defaultProps = {
  style: {},
};

export default TextPill;
