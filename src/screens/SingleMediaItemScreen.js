import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { ScrollView, Text, View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import momentPropTypes from 'react-moment-proptypes';

import appPropTypes from '../propTypes';
import PlayableItemHeader from '../components/PlayableItemHeader';
import ItemDescription from '../components/ItemDescription';
import PersonList from '../components/PersonList';
import SocialLinksSection from '../components/SocialLinksSection';
import TagList from '../components/TagList';

import * as playbackActions from '../state/ducks/playback/actions';
import * as playbackSelectors from '../state/ducks/playback/selectors';
import { fetchData } from '../state/ducks/orm/actions';

const padding = 15;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
  },
  subContainer: {
    padding,
  },
  peopleContainer: {
    paddingVertical: padding,
    paddingLeft: padding,
  },
  divider: {
    height: 1,
    backgroundColor: '#EDEDED',
    marginVertical: 15,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
  },
});

const SingleMediaItemScreen = ({
  mediaType, item, elapsed, play, navigation, refresh,
}) => {
  useEffect(() => {
    if (!item) {
      refresh(mediaType);
      const itemType = {
        podcasts: 'podcastEpisodes',
        meditationCategories: 'meditations',
        liturgies: 'liturgyItems',
      }[mediaType];
      refresh(itemType);
    }
  }, [item]);

  if (!item) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.subContainer}>
        <PlayableItemHeader item={item} elapsed={elapsed} onPlay={() => play()} />
        <View style={styles.divider} />
        <ItemDescription item={item} />
      </View>
      <View style={styles.peopleContainer}>
        <PersonList
          people={item.contributors}
          onPressPerson={(person) => {
            const params = { contributor: person };
            navigation.navigate({ routeName: 'Contributor', params });
          }}
        />
      </View>
      <View style={styles.subContainer}>
        <TagList
          tags={item.tags}
          onTagPress={(tag) => {
            navigation.navigate({
              routeName: 'SearchResults',
              params: { filterField: 'tag', filterValue: tag },
            });
          }}
        />
        <SocialLinksSection />
      </View>
    </ScrollView>
  );
};

SingleMediaItemScreen.propTypes = {
  mediaType: PropTypes.string.isRequired,
  item: appPropTypes.mediaItem,
  elapsed: momentPropTypes.momentDurationObj.isRequired,
  play: PropTypes.func.isRequired,
  refresh: PropTypes.func.isRequired,
  navigation: appPropTypes.navigation.isRequired,
};

SingleMediaItemScreen.defaultProps = {
  item: null,
};

function mapStateToProps(state, { item }) {
  const status = item ? playbackSelectors.getLastStatusForItem(state, item.id) : null;
  const elapsed = status ? moment.duration(status.positionMillis, 'ms') : moment.duration();
  return { elapsed };
}

function mapDispatchToProps(dispatch, { navigation, item }) {
  return {
    play: () => {
      dispatch(
        playbackActions.setPlaying(item),
      );
      navigation.navigate('Player');
    },
    refresh: (mediaType) => {
      dispatch(fetchData({ resource: mediaType }));
    },
  };
}


export default withNavigation(
  connect(mapStateToProps, mapDispatchToProps)(SingleMediaItemScreen),
);
