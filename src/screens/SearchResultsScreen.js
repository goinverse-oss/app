import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FlatList, StyleSheet } from 'react-native';
import pluralize from 'pluralize';

import { getCommonNavigationOptions } from '../navigation/common';
import BackButton from '../navigation/BackButton';
import { filteredCollectionSelector, apiLoadingSelector } from '../state/ducks/orm/selectors';
import { fetchData } from '../state/ducks/orm';
import appPropTypes from '../propTypes';
import PodcastEpisodeListCard from '../components/PodcastEpisodeListCard';
import MeditationListCard from '../components/MeditationListCard';
import LiturgyItemListCard from '../components/LiturgyItemListCard';

const styles = StyleSheet.create({
  container: {
    paddingVertical: 7,
  },
  card: {
    marginHorizontal: 14,
    marginVertical: 7,
  },
});

const listCardTypes = {
  podcastEpisode: PodcastEpisodeListCard,
  meditation: MeditationListCard,
  liturgyItem: LiturgyItemListCard,
};

/**
 * List of items matching a search - e.g. matches contributor.
 */
const SearchResultsScreen = ({
  items,
  refreshing,
  refresh,
}) => (
  <FlatList
    style={styles.container}
    refreshing={refreshing}
    onRefresh={() => refresh()}
    data={items}
    keyExtractor={item => item.id}
    renderItem={
      ({ item }) => {
        const ItemListCard = listCardTypes[item.type];
        return <ItemListCard key={item.id} style={styles.card} item={item} />;
      }
    }
  />
);

SearchResultsScreen.propTypes = {
  items: PropTypes.arrayOf(
    appPropTypes.mediaItem.isRequired,
  ).isRequired,
  refreshing: PropTypes.bool.isRequired,
  refresh: PropTypes.func.isRequired,
};

function getParams(navigation) {
  const { state: { params } } = navigation;
  return params;
}

function makeMapStateToProps(factoryState, { navigation }) {
  const { type, contributor } = getParams(navigation);
  const selector = filteredCollectionSelector(
    factoryState,
    type,
    item => item.contributors.filter(contributor).count() > 0,
  );

  return function mapStateToProps(state) {
    return {
      items: selector(state),
      refreshing: (
        apiLoadingSelector(state, pluralize(type))
      ),
    };
  };
}

function mapDispatchToProps(dispatch, { navigation }) {
  const { type } = getParams(navigation);
  return {
    refresh: () => {
      dispatch(
        fetchData({
          resource: type,
        }),
      );
    },
  };
}

export function getTitle({ type, contributor }) {
  // for now, search results are limited to links from contributor screens,
  // so we're keeping the title simple and informative based on that.
  const title = {
    podcastEpisode: 'Podcasts',
    meditation: 'Meditations',
    liturgyItem: 'Liturgies',
  }[type];
  const firstName = contributor.name.split(' ')[0];
  return `${title} with ${firstName}`;
}

SearchResultsScreen.navigationOptions = ({ screenProps, navigation }) => ({
  ...getCommonNavigationOptions(screenProps.drawer),
  headerLeft: <BackButton />,
  title: getTitle(getParams(navigation)),
});

export default connect(makeMapStateToProps, mapDispatchToProps)(SearchResultsScreen);
