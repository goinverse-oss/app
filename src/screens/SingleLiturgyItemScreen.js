import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import SingleMediaItemScreen from './SingleMediaItemScreen';
import LiturgyItem from '../state/models/LiturgyItem';
import { liturgyItemSelector } from '../state/ducks/orm/selectors';

const SingleLiturgyItemScreen = ({ item }) => (
  <SingleMediaItemScreen item={item} mediaType="liturgies" />
);

SingleLiturgyItemScreen.propTypes = {
  item: PropTypes.shape(LiturgyItem.propTypes),
};

SingleLiturgyItemScreen.defaultProps = {
  item: null,
};

function mapStateToProps(state, { route }) {
  const { params: { liturgyItem } } = route;
  return {
    item: liturgyItemSelector(state, liturgyItem.id),
  };
}

export default connect(mapStateToProps)(SingleLiturgyItemScreen);
