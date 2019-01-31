import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ScrollView, RefreshControl } from 'react-native';

import appPropTypes from '../propTypes';
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
      episodes.map(
        episode => (
          <PodcastEpisodeListCard
            key={episode.id}
            episode={episode}
            onPress={() => navigation.navigate({
              routeName: 'SinglePodcastEpisode',
              params: { episode },
            })}
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
  refreshCategory: PropTypes.func.isRequired,
  navigation: appPropTypes.navigation.isRequired,
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
      apiLoadingSelector(state, 'podcast')
    ),
  };
}

function mapDispatchToProps(dispatch, { navigation }) {
  const { state: { params: { podcast } } } = navigation;

  return {
    refreshCategory: () => {
      dispatch(
        fetchData({
          id: podcast.id,
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
