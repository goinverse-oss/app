import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, ViewPropTypes } from 'react-native';
import { connect } from 'react-redux';
import { withNavigation } from '@react-navigation/compat';

import Button from '../../components/Button';
import Contributor from '../../state/models/Contributor';
import { getTitle } from '../SearchResultsScreen';
import { filteredCollectionSelector } from '../../state/ducks/orm/selectors';
import TextPill from '../../components/TextPill';
import { screenRelativeWidth } from '../../components/utils';
import appPropTypes from '../../propTypes';
import PodcastEpisodeListCard from '../../components/PodcastEpisodeListCard';
import MeditationListCard from '../../components/MeditationListCard';
import LiturgyItemListCard from '../../components/LiturgyItemListCard';

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    marginVertical: 13,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginVertical: 10,
  },
  title: {
    color: '#9B9B9B',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 6,
  },
  items: {
    width: screenRelativeWidth(1.0) - 34,
  },
  card: {
    marginVertical: 7,
  },
  button: {
    height: 44,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonText: {
    fontWeight: '600',
    color: '#797979',
    fontSize: 15,
  },
});

const typeTitles = {
  podcastEpisode: 'Podcasts',
  meditation: 'Meditations',
  liturgyItem: 'Liturgies',
};

const listCardTypes = {
  podcastEpisode: PodcastEpisodeListCard,
  meditation: MeditationListCard,
  liturgyItem: props => (
    <LiturgyItemListCard
      {...props}
      renderDescription={item => `from the "${item.liturgy.title}" liturgy`}
    />
  ),
};

const maxEntries = 3;

const Contributions = ({
  style, type, contributor, items, viewAll,
}) => {
  if (items.length === 0) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{typeTitles[type]}</Text>
        <TextPill>{`${items.length}`}</TextPill>
      </View>
      <View style={styles.items}>
        {
          items.slice(0, maxEntries).map(
            (item) => {
              const ItemListCard = listCardTypes[item.type];
              return <ItemListCard key={item.id} style={styles.card} item={item} />;
            },
          )
        }
      </View>
      <Button
        style={styles.button}
        onPress={() => viewAll()}
      >
        <Text style={styles.buttonText}>
          {`View All ${getTitle({ type, filterField: 'contributor', filterValue: contributor })}`}
        </Text>
      </Button>
    </View>
  );
};

Contributions.propTypes = {
  // contributor is used in mapStateToProps, but not directly in rendering.
  // eslint-disable-next-line
  contributor: PropTypes.shape(Contributor.propTypes).isRequired,
  style: ViewPropTypes.style,
  type: PropTypes.oneOf(Object.keys(typeTitles)).isRequired,
  items: PropTypes.arrayOf(
    appPropTypes.mediaItem.isRequired,
  ).isRequired,
  viewAll: PropTypes.func.isRequired,
};

Contributions.defaultProps = {
  style: {},
};

function makeMapStateToProps(factoryState, { contributor, type }) {
  const selector = filteredCollectionSelector(
    factoryState,
    type,

    // only return items with the specified contributor
    item => item.contributors.filter(contributor).count() > 0,
  );
  return function mapStateToProps(state) {
    return {
      items: selector(state),
    };
  };
}

function mapDispatchToProps(dispatch, { contributor, type, navigation }) {
  return {
    viewAll: () => navigation.navigate(
      'SearchResults',
      { filterField: 'contributor', filterValue: contributor, type },
    ),
  };
}

export default withNavigation(
  connect(makeMapStateToProps, mapDispatchToProps)(Contributions),
);
