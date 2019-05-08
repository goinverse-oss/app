import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FlatList, StyleSheet } from 'react-native';

import { getCommonNavigationOptions } from '../navigation/common';
import BackButton from '../navigation/BackButton';
import LiturgyItemListCard from '../components/LiturgyItemListCard';
import LiturgyItem from '../state/models/LiturgyItem';
import { liturgySelector, apiLoadingSelector } from '../state/ducks/orm/selectors';
import { fetchData } from '../state/ducks/orm';

const styles = StyleSheet.create({
  container: {
    paddingVertical: 7,
  },
  card: {
    marginHorizontal: 14,
    marginVertical: 7,
  },
});

/**
 * List of items in liturgy, sorted by track number.
 */
const LiturgyScreen = ({
  items,
  refreshing,
  refreshLiturgyItems,
}) => (
  <FlatList
    style={styles.container}
    refreshing={refreshing}
    onRefresh={() => refreshLiturgyItems()}
    data={items}
    keyExtractor={item => item.id}
    renderItem={
      ({ item }) => <LiturgyItemListCard style={styles.card} item={item} />
    }
  />
);

LiturgyScreen.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape(LiturgyItem.propTypes).isRequired,
  ),
  refreshing: PropTypes.bool.isRequired,
  refreshLiturgyItems: PropTypes.func.isRequired,
};

LiturgyScreen.defaultProps = {
  items: [],
};

function mapStateToProps(state, { navigation }) {
  const { state: { params: { liturgy } } } = navigation;
  const { items } = liturgySelector(state, liturgy.id);
  return {
    items,
    refreshing: (
      apiLoadingSelector(state, 'liturgyItems')
    ),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    refreshLiturgyItems: () => {
      dispatch(
        fetchData({
          resource: 'liturgyItems',
        }),
      );
    },
  };
}

LiturgyScreen.navigationOptions = ({ screenProps, navigation }) => ({
  ...getCommonNavigationOptions(screenProps.drawer),
  headerLeft: <BackButton />,
  title: navigation.state.params.liturgy.title,
});

export default connect(mapStateToProps, mapDispatchToProps)(LiturgyScreen);
