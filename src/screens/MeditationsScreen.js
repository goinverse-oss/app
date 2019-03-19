import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ScrollView, RefreshControl } from 'react-native';

import appPropTypes from '../propTypes';
import { getCommonNavigationOptions } from '../navigation/common';
import MeditationSeriesList from '../components/MeditationSeriesList';
import * as patreonSelectors from '../state/ducks/patreon/selectors';
import { fetchData, fetchAsset } from '../state/ducks/orm';
import { ALL_MEDITATIONS_COVER_ART } from '../state/ducks/orm/actions';
import MeditationCategory from '../state/models/MeditationCategory';
import {
  meditationsSelector,
  meditationCategoriesSelector,
  assetUrlSelector,
  apiLoadingSelector,
} from '../state/ducks/orm/selectors';

/**
 * List of available meditations, organized by category.
 */
class MeditationsScreen extends Component {
  componentDidMount() {
    const { fetchMeditations, fetchAllMeditationsCoverArt } = this.props;
    fetchMeditations();
    fetchAllMeditationsCoverArt();
  }

  render() {
    const { categories, navigation, allMeditationsCoverArtUrl } = this.props;
    const meditationCategories = [
      {
        title: 'All Meditations',
        imageUrl: allMeditationsCoverArtUrl,
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
  allMeditationsCoverArtUrl: PropTypes.string,
  fetchMeditations: PropTypes.func.isRequired,
  fetchAllMeditationsCoverArt: PropTypes.func.isRequired,
  refreshing: PropTypes.bool.isRequired,
  navigation: appPropTypes.navigation.isRequired,
};

MeditationsScreen.defaultProps = {
  categories: [],
  allMeditationsCoverArtUrl: null,
};

function mapStateToProps(state) {
  return {
    meditations: meditationsSelector(state),
    categories: meditationCategoriesSelector(state),
    allMeditationsCoverArtUrl: assetUrlSelector(state, ALL_MEDITATIONS_COVER_ART),
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
    fetchAllMeditationsCoverArt: () => dispatch(
      fetchAsset(ALL_MEDITATIONS_COVER_ART),
    ),
  };
}

MeditationsScreen.navigationOptions = ({ screenProps }) => ({
  ...getCommonNavigationOptions(screenProps.drawer),
  title: 'Meditations',
});

export default connect(mapStateToProps, mapDispatchToProps)(MeditationsScreen);
