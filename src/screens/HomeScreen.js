import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import moment from 'moment';
import {
  Image,
  Text,
  TouchableWithoutFeedback,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';

import TextPill from '../components/TextPill';

import appPropTypes from '../propTypes';
import { getCommonNavigationOptions } from '../navigation/common';
import * as navActions from '../navigation/actions';
import { recentMediaItemsSelector } from '../state/ducks/orm/selectors';
import { getImageSource } from '../state/ducks/orm/utils';
import { fetchData } from '../state/ducks/orm/actions';
import * as playbackSelectors from '../state/ducks/playback/selectors';
import { screenRelativeWidth, screenRelativeHeight, formatFooter } from '../components/utils';

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  itemContainer: {
    padding: 10,
    maxWidth: screenRelativeWidth(0.85) + 20,
  },
  largeImage: {
    width: screenRelativeWidth(0.85),
    flex: 1,
    borderRadius: 4,
    marginBottom: 20,
    resizeMode: 'cover',
  },
  mediaTypeContainer: {
    flexDirection: 'row',
    marginBottom: screenRelativeHeight(0.01),
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
  },
  details: {
    color: '#9B9B9B',
    fontSize: 12,
  },
});

/**
 * Landing screen, containing a preview
 * of the other stuff you can get to via the tabs.
 */
class HomeScreen extends React.Component {
  componentDidMount() {
    this.props.refresh();
  }

  render() {
    const { items, onItemPress } = this.props;

    // Use explicit snap offsets to center each image in the middle of the list,
    // but still allow snapping to the start and end of the list.
    const snapWidth = styles.largeImage.width + 20;
    const snapOffsets = items.slice(1, -1).map(
      (item, i) => (
        ((i + 1) * snapWidth) - 7.5
      ),
    );
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToOffsets={snapOffsets}
        decelerationRate="fast"
        contentContainerStyle={styles.container}
      >
        {
          items.map(item => (
            <TouchableWithoutFeedback
              key={item.id}
              onPress={() => onItemPress(item)}
            >
              <View style={styles.itemContainer}>
                <Image
                  style={styles.largeImage}
                  source={getImageSource(item, true)}
                />
                <View style={styles.mediaTypeContainer}>
                  <TextPill>
                    {item.type.replace('Episode', '')}
                  </TextPill>
                </View>
                <Text style={styles.title} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.details} numberOfLines={1}>
                  {formatFooter(item)}
                </Text>
              </View>
            </TouchableWithoutFeedback>
          ))
        }
      </ScrollView>
    );
  }
}

HomeScreen.propTypes = {
  items: PropTypes.arrayOf(appPropTypes.mediaItem).isRequired,
  refresh: PropTypes.func.isRequired,
  onItemPress: PropTypes.func.isRequired,
};

HomeScreen.navigationOptions = ({ screenProps }) => ({
  ...getCommonNavigationOptions(screenProps.drawer),
  title: 'The Liturgists',
});

function mapStateToProps(state) {
  return {
    items: recentMediaItemsSelector(state).map(
      (item) => {
        const status = playbackSelectors.getLastStatusForItem(state, item.id);
        if (status) {
          return _.set(item, 'elapsed', moment.duration(status.positionMillis, 'ms'));
        }
        return item;
      },
    ),
  };
}

function mapDispatchToProps(dispatch, { navigation }) {
  return {
    refresh: () => {
      dispatch(fetchData({ resource: 'podcasts' }));
      dispatch(fetchData({ resource: 'podcastEpisodes' }));
      dispatch(fetchData({ resource: 'meditationCategories' }));
      dispatch(fetchData({ resource: 'meditations' }));
      dispatch(fetchData({ resource: 'liturgies' }));
      dispatch(fetchData({ resource: 'liturgyItems' }));
    },
    openItem: item => navActions.openItem(navigation, item),
    openPatreon: () => navigation.navigate('Patreon'),
  };
}

function mergeProps(stateProps, dispatchProps, ownProps) {
  const canAccess = item => (
    !_.get(item, 'patronsOnly', false)
      || _.get(item, 'isFreePreview', false)
  );
  const { refresh, openItem, openPatreon } = dispatchProps;
  return {
    ...stateProps,
    refresh,
    onItemPress: item => (canAccess(item) ? openItem(item) : openPatreon()),
    ...ownProps,
  };
}

export default withNavigation(
  connect(mapStateToProps, mapDispatchToProps, mergeProps)(HomeScreen),
);
