import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ScrollView, RefreshControl } from 'react-native';

import appPropTypes from '../propTypes';
import { getCommonNavigationOptions } from '../navigation/common';
import MeditationSeriesList from '../components/MeditationSeriesList';
import * as patreonSelectors from '../state/ducks/patreon/selectors';
import { fetchData } from '../state/ducks/orm';
import MeditationCategory from '../state/models/MeditationCategory';
import {
  meditationsSelector,
  meditationCategoriesSelector,
  apiLoadingSelector,
} from '../state/ducks/orm/selectors';

/**
 * List of available meditations, organized by category.
 */
class MeditationsScreen extends Component {
  componentDidMount() {
    const { fetchMeditations } = this.props;
    fetchMeditations();
  }

  render() {
    const { categories, navigation } = this.props;
    const meditationCategories = [
      {
        title: 'All Meditations',
        imageUrl: 'https://images.ctfassets.net/80rg4ikyq3mh/4fw1cG2nsTZ9Upl3jpWDVH/3c71279543e32f52240f9b55d76d9313/meditation-2240777_1280.jpg',
      },
      ...categories,
    ];

    return (
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={this.props.refreshing}
            onRefresh={() => this.props.fetchMeditations()}
          />
        }
      >
        <MeditationSeriesList
          meditationCategories={meditationCategories}
          onPressMeditationCategory={category => navigation.navigate({
            routeName: 'MeditationsCategory',
            params: { category },
          })}
        />
      </ScrollView>
    );
  }
}

MeditationsScreen.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape(MeditationCategory.propTypes),
  ),
  fetchMeditations: PropTypes.func.isRequired,
  refreshing: PropTypes.bool.isRequired,
  navigation: appPropTypes.navigation.isRequired,
};

MeditationsScreen.defaultProps = {
  categories: [],
};

function mapStateToProps(state) {
  return {
    meditations: meditationsSelector(state),
    categories: meditationCategoriesSelector(state),
    isPatron: patreonSelectors.isPatron(state),
    refreshing: apiLoadingSelector(state, 'meditations'),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchMeditations: () => dispatch(
      fetchData({
        resource: 'meditations',
      }),
    ),
  };
}

MeditationsScreen.navigationOptions = ({ screenProps }) => ({
  ...getCommonNavigationOptions(screenProps.drawer),
  title: 'Meditations',
});

export default connect(mapStateToProps, mapDispatchToProps)(MeditationsScreen);
