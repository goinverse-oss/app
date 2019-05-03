import React from 'react';
import PropTypes from 'prop-types';
import { Text, StyleSheet, ViewPropTypes } from 'react-native';

const styles = StyleSheet.create({
  header: {
    fontSize: 17,
    fontWeight: '600',
    color: '#9B9B9B',
  },
});

const SectionHeader = ({ style, children }) => (
  <Text style={[styles.header, style]}>
    {children}
  </Text>
);

SectionHeader.propTypes = {
  style: ViewPropTypes.style,
  children: PropTypes.string.isRequired,
};

SectionHeader.defaultProps = {
  style: {},
};

export default SectionHeader;
