import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';

import Card from './Card';

const styles = StyleSheet.create({
  card: {
    width: '94.7%',
    padding: 10,
    marginHorizontal: '2.7%',
    marginVertical: '2%',
  },
});

const ListCard = ({ children, style }) => (
  <Card style={[styles.card, style]}>
    {children}
  </Card>
);

ListCard.propTypes = {
  children: PropTypes.node,
  style: View.propTypes.style,
};

ListCard.defaultProps = {
  children: null,
  style: {},
};

export default ListCard;
