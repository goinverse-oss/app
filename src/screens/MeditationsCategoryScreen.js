import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FlatList, StyleSheet } from 'react-native';

import { getCommonNavigationOptions } from '../navigation/common';
import BackButton from '../navigation/BackButton';
import MeditationListCard from '../components/MeditationListCard';
import Meditation from '../state/models/Meditation';
import {
  meditationCategorySelector,
  meditationsSelector,
  apiLoadingSelector,
} from '../state/ducks/orm/selectors';
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
 * List of meditations in category, sorted by publish date.
 */
const MeditationsCategoryScreen = ({
  meditations,
  refreshing,
  refreshMeditations,
}) => (
  <FlatList
    style={styles.container}
    refreshing={refreshing}
    onRefresh={() => refreshMeditations()}
    data={meditations}
    keyExtractor={item => item.id}
    renderItem={
      ({ item }) => <MeditationListCard style={styles.card} item={item} />
    }
  />
);

MeditationsCategoryScreen.propTypes = {
  meditations: PropTypes.arrayOf(
    PropTypes.shape(Meditation.propTypes).isRequired,
  ),
  refreshing: PropTypes.bool.isRequired,
  refreshMeditations: PropTypes.func.isRequired,
};

MeditationsCategoryScreen.defaultProps = {
  meditations: [],
};

function mapStateToProps(state, { navigation }) {
  const { state: { params: { category } } } = navigation;
  const meditations = (
    category.title === 'All Meditations'
      ? meditationsSelector(state)
      : meditationCategorySelector(state, category.id).meditations
  );
  return {
    meditations,
    refreshing: (
      apiLoadingSelector(state, 'meditations') ||
      apiLoadingSelector(state, 'meditationCategories')
    ),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    refreshMeditations: () => {
      dispatch(
        fetchData({
          resource: 'meditations',
        }),
      );
    },
  };
}

MeditationsCategoryScreen.navigationOptions = ({ screenProps, navigation }) => ({
  ...getCommonNavigationOptions(screenProps.drawer),
  headerLeft: <BackButton />,
  title: navigation.state.params.category.title,
});

export default connect(mapStateToProps, mapDispatchToProps)(MeditationsCategoryScreen);
