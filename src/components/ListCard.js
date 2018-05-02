import React from 'react';
import PropTypes from 'prop-types';
import { ViewPropTypes, StyleSheet } from 'react-native';

import Card from './Card';

const styles = StyleSheet.create({
  card: {
    width: '94.7%',
    padding: 10,
    marginHorizontal: '2.7%',
    marginVertical: '2%',
  },
});

const ListCard = ({ children, style, ...props }) => (
  <Card style={[styles.card, style]} {...props} >
    {children}
  </Card>
);

ListCard.propTypes = {
  children: PropTypes.node,
  style: ViewPropTypes.style,
};

ListCard.defaultProps = {
  children: null,
  style: {},
};

export default ListCard;
