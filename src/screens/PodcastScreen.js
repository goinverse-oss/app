import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ScrollView, RefreshControl } from 'react-native';

import { getCommonNavigationOptions } from '../navigation/common';
import BackButton from '../navigation/BackButton';
import PodcastEpisodeListCard from '../components/PodcastEpisodeListCard';
import * as patreonSelectors from '../state/ducks/patreon/selectors';
import PodcastEpisode from '../state/models/PodcastEpisode';
import { podcastSelector, apiLoadingSelector } from '../state/ducks/orm/selectors';
import { fetchData } from '../state/ducks/orm';

/**
 * List of episodes in podcast, sorted by publish date.
 */
const PodcastScreen = ({
  episodes,
  refreshing,
  refreshPodcastEpisodes,
}) => (
  <ScrollView
    refreshControl={
      <RefreshControl
        refreshing={refreshing}
        onRefresh={() => refreshPodcastEpisodes()}
      />
    }
  >
    {
      episodes.map(
        episode => (
          <PodcastEpisodeListCard
            key={episode.id}
            episode={episode}
          />
        ),
      )
    }
  </ScrollView>
);

PodcastScreen.propTypes = {
  episodes: PropTypes.arrayOf(
    PropTypes.shape(PodcastEpisode.propTypes).isRequired,
  ),
  refreshing: PropTypes.bool.isRequired,
  refreshPodcastEpisodes: PropTypes.func.isRequired,
};

PodcastScreen.defaultProps = {
  episodes: [],
};

function mapStateToProps(state, { navigation }) {
  const { state: { params: { podcast } } } = navigation;
  const { episodes } = podcastSelector(state, podcast.id);
  return {
    episodes,
    isPatron: patreonSelectors.isPatron(state),
    refreshing: (
      apiLoadingSelector(state, 'podcastEpisodes')
    ),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    refreshPodcastEpisodes: () => {
      dispatch(
        fetchData({
          resource: 'podcastEpisodes',
        }),
      );
    },
  };
}

PodcastScreen.navigationOptions = ({ screenProps, navigation }) => ({
  ...getCommonNavigationOptions(screenProps.drawer),
  headerLeft: <BackButton />,
  title: navigation.state.params.podcast.title,
});

export default connect(mapStateToProps, mapDispatchToProps)(PodcastScreen);
