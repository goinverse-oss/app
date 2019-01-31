import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ScrollView, RefreshControl } from 'react-native';

import appPropTypes from '../propTypes';
import { getCommonNavigationOptions } from '../navigation/common';
import PodcastSeriesList from '../components/PodcastSeriesList';
import * as patreonSelectors from '../state/ducks/patreon/selectors';
import { fetchData } from '../state/ducks/orm';
import {
  podcastsSelector,
  apiLoadingSelector,
} from '../state/ducks/orm/selectors';

/**
 * List of available podcasts.
 */
class PodcastsScreen extends Component {
  componentDidMount() {
    const { fetchPodcastEpisodes } = this.props;
    fetchPodcastEpisodes();
  }

  render() {
    const { podcasts, navigation } = this.props;
    return (
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={this.props.refreshing}
            onRefresh={() => this.props.fetchPodcastEpisodes()}
          />
        }
      >
        <PodcastSeriesList
          podcasts={podcasts}
          onPressPodcast={podcast => navigation.navigate({
            routeName: 'Podcast',
            params: { podcast },
          })}
        />
      </ScrollView>
    );
  }
}

PodcastsScreen.propTypes = {
  podcasts: PropTypes.arrayOf(
    PropTypes.shape({}),
  ),
  fetchPodcastEpisodes: PropTypes.func.isRequired,
  refreshing: PropTypes.bool.isRequired,
  navigation: appPropTypes.navigation.isRequired,
};

PodcastsScreen.defaultProps = {
  podcasts: [],
};

function mapStateToProps(state) {
  return {
    podcasts: podcastsSelector(state),
    isPatron: patreonSelectors.isPatron(state),
    refreshing: apiLoadingSelector(state, 'podcasts'),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchPodcastEpisodes: () => dispatch(
      fetchData({
        resource: 'podcastEpisodes',
      }),
    ),
  };
}

PodcastsScreen.navigationOptions = ({ screenProps }) => ({
  ...getCommonNavigationOptions(screenProps.drawer),
  title: 'Podcasts',
});

export default connect(mapStateToProps, mapDispatchToProps)(PodcastsScreen);
