import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import SingleMediaItemScreen from './SingleMediaItemScreen';
import { getCommonNavigationOptions } from '../navigation/common';
import BackButton from '../navigation/BackButton';
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

function mapStateToProps(state, { navigation }) {
  const { state: { params: { liturgyItem } } } = navigation;
  return {
    item: liturgyItemSelector(state, liturgyItem.id),
  };
}

SingleLiturgyItemScreen.navigationOptions = ({ screenProps }) => ({
  ...getCommonNavigationOptions(screenProps.drawer),
  headerLeft: <BackButton />,
  title: 'Liturgies',
});

export default connect(mapStateToProps)(SingleLiturgyItemScreen);
