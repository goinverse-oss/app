import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FlatList, StyleSheet } from 'react-native';

import { getCommonNavigationOptions } from '../navigation/common';
import BackButton from '../navigation/BackButton';
import FeedButton from '../components/FeedButton';
import PodcastEpisodeListCard from '../components/PodcastEpisodeListCard';
import PodcastEpisode from '../state/models/PodcastEpisode';
import { podcastSelector, apiLoadingSelector } from '../state/ducks/orm/selectors';
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
 * List of episodes in podcast, sorted by publish date.
 */
const PodcastScreen = ({
  episodes,
  refreshing,
  refreshPodcastEpisodes,
}) => (
  <FlatList
    style={styles.container}
    refreshing={refreshing}
    onRefresh={() => refreshPodcastEpisodes()}
    data={episodes}
    keyExtractor={item => item.id}
    renderItem={
      ({ item }) => <PodcastEpisodeListCard style={styles.card} item={item} />
    }
  />
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

function getPodcast(navigation) {
  const { state: { params: { podcast } } } = navigation;
  return podcast;
}

function mapStateToProps(state, { navigation }) {
  const podcast = getPodcast(navigation);
  const { episodes } = podcastSelector(state, podcast.id);
  return {
    episodes,
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
  headerRight: <FeedButton collection={getPodcast(navigation)} />,
  title: navigation.state.params.podcast.title,
});

export default connect(mapStateToProps, mapDispatchToProps)(PodcastScreen);
