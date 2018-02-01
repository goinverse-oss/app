import React from 'react';
import PropTypes from 'prop-types';
import { Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  header: {
    fontSize: 17,
    fontWeight: '600',
    color: '#9B9B9B',
  },
});

const SectionHeader = ({ children }) => (
  <Text style={styles.header}>
    {children}
  </Text>
);

SectionHeader.propTypes = {
  children: PropTypes.string.isRequired,
};

export default SectionHeader;
