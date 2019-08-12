import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FlatList, StyleSheet } from 'react-native';
import pluralize from 'pluralize';

import { getCommonNavigationOptions } from '../navigation/common';
import BackButton from '../navigation/BackButton';
import {
  filteredAllMediaSelector,
  filteredCollectionSelector,
  apiLoadingSelector,
} from '../state/ducks/orm/selectors';
import { capitalize } from '../state/ducks/orm/utils';
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
  const { type, filterField, filterValue } = getParams(navigation);
  const filterFunc = item => item[`${filterField}s`].filter(filterValue).count() > 0;
  const selector = (
    type
      ? filteredCollectionSelector(factoryState, type, filterFunc)
      : filteredAllMediaSelector(factoryState, filterFunc)
  );

  return function mapStateToProps(state) {
    const resources = type ? [type] : ['podcastEpisode', 'meditation', 'liturgyItem'];
    return {
      items: selector(state),
      refreshing: (
        resources.some(resource => apiLoadingSelector(state, pluralize(resource)))
      ),
    };
  };
}

function mapDispatchToProps(dispatch, { navigation }) {
  const { type } = getParams(navigation);
  const resources = type ? [type] : ['podcastEpisode', 'meditation', 'liturgyItem'];
  return {
    refresh: () => {
      resources.forEach(
        resource => dispatch(fetchData({ resource })),
      );
    },
  };
}

export function getTitle({ type, filterField, filterValue }) {
  // for now, search results are limited to links from contributor screens,
  // so we're keeping the title simple and informative based on that.
  let name;
  switch (filterField) {
    case 'contributor':
      name = filterValue.name.split(' ')[0];
      break;
    case 'tag':
      name = filterValue.name;
      break;
    default:
      throw new Error(`Unknown filterField ${filterField}`);
  }

  if (type) {
    const title = {
      podcastEpisode: 'Podcasts',
      meditation: 'Meditations',
      liturgyItem: 'Liturgies',
    }[type];

    return `${title} with ${name}`;
  }

  return `${capitalize(filterField)}: ${filterValue.name}`;
}

/*
 * Navigation props:
 *   type: 'podcastEpisode', 'meditation', 'liturgyItem', or null
 *     limits results to that type, if not null
 *   filterField: 'contributor' or 'tag'
 *   filterValue: value of the field to filter by
 */
SearchResultsScreen.navigationOptions = ({ screenProps, navigation }) => ({
  ...getCommonNavigationOptions(screenProps.drawer),
  headerLeft: <BackButton />,
  title: getTitle(getParams(navigation)),
});

export default connect(makeMapStateToProps, mapDispatchToProps)(SearchResultsScreen);
