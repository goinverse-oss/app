import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ScrollView, RefreshControl } from 'react-native';

import appPropTypes from '../propTypes';
import PodcastSeriesList from '../components/PodcastSeriesList';
import Podcast from '../state/models/Podcast';
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
          onPressPodcast={podcast => navigation.navigate(
            'Podcast',
            { podcast },
          )}
        />
      </ScrollView>
    );
  }
}

PodcastsScreen.propTypes = {
  podcasts: PropTypes.arrayOf(
    PropTypes.shape(Podcast.propTypes),
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
    podcasts: podcastsSelector(state).filter(podcast => podcast.episodes.length > 0),
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

export default connect(mapStateToProps, mapDispatchToProps)(PodcastsScreen);
