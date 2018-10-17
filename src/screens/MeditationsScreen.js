import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ScrollView, RefreshControl } from 'react-native';

import MeditationsIcon from './MeditationsIcon';
import { getCommonNavigationOptions } from '../navigation/common';
import MeditationSeriesList from '../components/MeditationSeriesList';
import * as patreonSelectors from '../state/ducks/patreon/selectors';
import { fetchData } from '../state/ducks/orm';
import {
  meditationsSelector,
  meditationCategoriesSelector,
  apiLoadingSelector,
} from '../state/ducks/orm/selectors';
import * as navActions from '../state/ducks/navigation/actions';

/**
 * List of available meditations, organized by category.
 */
class MeditationsScreen extends Component {
  componentDidMount() {
    const { fetchMeditations } = this.props;
    fetchMeditations();
  }

  render() {
    const { meditations, categories, viewMeditationCategory } = this.props;
    const meditationCategories = [
      {
        title: 'All Meditations',
        meditations,
        imageUrl: 'https://static1.squarespace.com/static/52fd5845e4b074ebcf586e7b/t/5a6b935be4966b484105c9d3/1516999519606/Centering+Prayer+Cover+Art.jpeg?format=500w',
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
          onPressMeditationCategory={category => viewMeditationCategory(category)}
        />
      </ScrollView>
    );
  }
}

MeditationsScreen.propTypes = {
  meditations: PropTypes.arrayOf(
    PropTypes.shape({}),
  ),
  categories: PropTypes.arrayOf(
    PropTypes.shape({}),
  ),
  fetchMeditations: PropTypes.func.isRequired,
  viewMeditationCategory: PropTypes.func.isRequired,
  refreshing: PropTypes.bool.isRequired,
};

MeditationsScreen.defaultProps = {
  meditations: [],
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
        params: {
          include: ['category', 'tags', 'contributors'],
        },
      }),
    ),
    viewMeditationCategory: category => dispatch(navActions.viewMeditationCategory(category)),
  };
}

MeditationsScreen.navigationOptions = ({ screenProps }) => ({
  ...getCommonNavigationOptions(screenProps.drawer),
  title: 'Meditations',
  tabBarIcon: MeditationsIcon,
});

export default connect(mapStateToProps, mapDispatchToProps)(MeditationsScreen);
