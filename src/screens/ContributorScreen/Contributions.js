import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, ViewPropTypes } from 'react-native';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';

import Button from '../../components/Button';
import Contributor from '../../state/models/Contributor';
import { getTitle } from '../SearchResultsScreen';
import { filteredCollectionSelector } from '../../state/ducks/orm/selectors';
import TextPill from '../../components/TextPill';
import PlayableListCard from '../../components/PlayableListCard';
import { screenRelativeWidth } from '../../components/utils';
import appPropTypes from '../../propTypes';

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
};

const maxEntries = 3;

const Contributions = ({
  style, type, contributor, items, viewAll,
}) => (
  <View style={[styles.container, style]}>
    <View style={styles.titleContainer}>
      <Text style={styles.title}>{typeTitles[type]}</Text>
      <TextPill>{`${items.length}`}</TextPill>
    </View>
    <View style={styles.items}>
      {
        items.slice(0, maxEntries).map(
          item => <PlayableListCard key={item.id} style={styles.card} item={item} />,
        )
      }
    </View>
    <Button
      style={styles.button}
      onPress={() => viewAll()}
    >
      <Text style={styles.buttonText}>
        {`View All ${getTitle({ type, contributor })}`}
      </Text>
    </Button>
  </View>
);

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
    viewAll: () => navigation.navigate({
      routeName: 'SearchResults',
      params: { contributor, type },
    }),
  };
}

export default withNavigation(
  connect(makeMapStateToProps, mapDispatchToProps)(Contributions),
);
