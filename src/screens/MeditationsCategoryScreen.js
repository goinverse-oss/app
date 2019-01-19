import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ScrollView, RefreshControl } from 'react-native';

import appPropTypes from '../propTypes';
import { getCommonNavigationOptions } from '../navigation/common';
import BackButton from '../navigation/BackButton';
import MeditationListCard from '../components/MeditationListCard';
import * as patreonSelectors from '../state/ducks/patreon/selectors';
import Meditation from '../state/models/Meditation';
import { meditationCategorySelector, apiLoadingSelector } from '../state/ducks/orm/selectors';
import { fetchData } from '../state/ducks/orm';

/**
 * List of meditations in category, sorted by publish date.
 */
const MeditationsCategoryScreen = ({
  meditations,
  refreshing,
  refreshCategory,
  navigation,
}) => (
  <ScrollView
    refreshControl={
      <RefreshControl
        refreshing={refreshing}
        onRefresh={() => refreshCategory()}
      />
    }
  >
    {
      meditations.map(
        meditation => (
          <MeditationListCard
            key={meditation.id}
            meditation={meditation}
            onPress={() => navigation.navigate({
              routeName: 'SingleMeditation',
              params: { meditation },
            })}
          />
        ),
      )
    }
  </ScrollView>
);

MeditationsCategoryScreen.propTypes = {
  meditations: PropTypes.arrayOf(
    PropTypes.shape(Meditation.propTypes).isRequired,
  ),
  refreshing: PropTypes.bool.isRequired,
  refreshCategory: PropTypes.func.isRequired,
  navigation: appPropTypes.navigation.isRequired,
};

MeditationsCategoryScreen.defaultProps = {
  meditations: [],
};

function mapStateToProps(state, { navigation }) {
  const { state: { params: { category } } } = navigation;
  const meditations = (
    category.title === 'All Meditations'
      ? category.meditations
      : meditationCategorySelector(state, category.id).meditations
  );
  return {
    meditations,
    isPatron: patreonSelectors.isPatron(state),
    refreshing: (
      apiLoadingSelector(state, 'meditations') ||
      apiLoadingSelector(state, 'meditationCategories')
    ),
  };
}

function mapDispatchToProps(dispatch, { navigation }) {
  const { state: { params: { category } } } = navigation;

  return {
    refreshCategory: () => {
      let action;
      if (category.title === 'All Meditations') {
        action = fetchData({
          resource: 'meditations',
        });
      } else {
        action = fetchData({
          id: category.id,
          // TODO: ensure related meditations are also fetched/updated?
        });
      }
      dispatch(action);
    },
  };
}

MeditationsCategoryScreen.navigationOptions = ({ screenProps, navigation }) => ({
  ...getCommonNavigationOptions(screenProps.drawer),
  headerLeft: <BackButton />,
  title: navigation.state.params.category.title,
});

export default connect(mapStateToProps, mapDispatchToProps)(MeditationsCategoryScreen);
