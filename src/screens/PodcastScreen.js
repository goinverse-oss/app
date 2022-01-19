import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FlatList, StyleSheet } from 'react-native';

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
    contentContainerStyle={styles.container}
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

function mapStateToProps(state, { route }) {
  const { params: { podcast } } = route;
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

export default connect(mapStateToProps, mapDispatchToProps)(PodcastScreen);
