import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {
  View,
  ViewPropTypes,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import { Foundation, FontAwesome } from '@expo/vector-icons';
import pluralize from 'pluralize';

import ListCard from './ListCard';
import SquareImage from './SquareImage';
import TextPill from './TextPill';
import * as ItemDescription from './ItemDescription';
import { formatFooter, formatMinutesString, formatHumanizeFromNow } from './utils';
import * as navActions from '../navigation/actions';

import appPropTypes from '../propTypes';
import * as actions from '../state/ducks/playback/actions';
import { getImageSource, getPublishedAt } from '../state/ducks/orm/utils';


const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 106,
  },
  imageContainer: {
    width: 86,
    height: 86,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
  },
  playIcon: {
    position: 'absolute',
    fontSize: 16,
    color: '#fff',
    left: 40,
    top: 35,
  },
  playCircle: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,
    borderColor: '#fff',
    borderWidth: 2,
  },
  metadataContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginLeft: 10,
  },
  textContainer: {
  },
  title: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    flexWrap: 'wrap',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  previewLabel: {
    marginLeft: 7,
  },
  patronsOnlyIcon: {
    fontSize: 12,
    marginLeft: 7,
  },
  description: {
    fontSize: 12,
    color: '#797979',
    minHeight: 40,
    marginVertical: 5,
    flexWrap: 'wrap',
    flexDirection: 'column',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  times: {
    fontSize: 12,
    color: '#797979',
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  mediaType: {
    marginRight: 5,
  },
});

function accessStyle({ patronsOnly, isFreePreview }) {
  return (!patronsOnly || isFreePreview) ? {} : {
    opacity: 0.5,
  };
}

const PlayIcon = () => (
  <Foundation name="play" style={styles.playIcon} />
);

const PreviewLabel = () => (
  <TextPill style={styles.previewLabel}>Free Preview</TextPill>
);

const PatronsOnlyIcon = () => (
  <FontAwesome name="lock" style={styles.patronsOnlyIcon} />
);

function stripTags(html) {
  return html.replace(/<[^>]+>/g, '');
}

const PlayableListCard = ({
  style,
  formatTitle,
  formatDuration,
  formatPublishedAt,
  renderDescription,
  isSearchResult,
  navigation,
  item,
  elapsed,
  canAccess,
  onPlay,
  ...props
}) => (
  <ListCard
    style={[
      styles.card,
      style,
      accessStyle(item),
    ]}
    {...props}
  >
    <TouchableWithoutFeedback onPress={() => onPlay()}>
      <View style={styles.imageContainer} >
        <SquareImage
          source={getImageSource(item)}
          width={86}
          style={styles.image}
        />
        <PlayIcon />
        <View style={styles.playCircle} />
      </View>
    </TouchableWithoutFeedback>
    <View style={styles.metadataContainer}>
      {isSearchResult ? (
        <View style={styles.searchHeader}>
          <TextPill style={styles.mediaType}>{pluralize.singular(item.type.replace('Episode', ''))}</TextPill>
          <Text style={styles.times}>
            {formatFooter({
              duration: item.duration,
              publishedAt: getPublishedAt(item),
              elapsed,
              formatDuration,
            })}
          </Text>
        </View>
      ) : null}
      <View style={styles.textContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={1}>{formatTitle(item)}</Text>
          {
            item.patronsOnly
              && (
                item.isFreePreview
                  ? <PreviewLabel />
                  : <PatronsOnlyIcon />
              )
          }
        </View>
        <Text
          style={[
            styles.description,
            (isSearchResult ? { minHeight: 0 } : {}),
          ]}
          numberOfLines={2}
        >
          {stripTags(renderDescription(item))}
        </Text>
      </View>
      {isSearchResult ? null : (
        <View style={styles.footer}>
          <Text style={styles.times}>
            {formatFooter({
              duration: item.duration,
              publishedAt: getPublishedAt(item),
              elapsed,
              formatDuration,
              formatPublishedAt,
             })}
          </Text>
        </View>
      )}
    </View>
  </ListCard>
);

PlayableListCard.propTypes = {
  style: ViewPropTypes.style,
  navigation: appPropTypes.navigation.isRequired,
  item: appPropTypes.mediaItem.isRequired,
  elapsed: PropTypes.string,
  formatTitle: PropTypes.func,
  formatDuration: PropTypes.func,
  renderDescription: PropTypes.func,
  isSearchResult: PropTypes.bool,
  canAccess: PropTypes.bool.isRequired,
  onPlay: PropTypes.func.isRequired,
  onPress: PropTypes.func.isRequired,
};

PlayableListCard.defaultProps = {
  style: {},
  elapsed: 'P0D',
  formatTitle: item => item.title,
  formatDuration: formatMinutesString,
  formatPublishedAt: formatHumanizeFromNow,
  renderDescription: ItemDescription.renderDescription,
  isSearchResult: false,
};

function mapStateToProps(state, { item }) {
  return {
    canAccess: (
      !_.get(item, 'patronsOnly', false)
        || _.get(item, 'isFreePreview', false)
    ),
  };
}

function mapDispatchToProps(dispatch, { navigation, item }) {
  return {
    openPlayer: () => {
      dispatch(
        actions.setPlaying(item),
      );
      navigation.navigate('Player');
    },
    openItem: () => navigation.navigate(navActions.openItem(item)),
    openPatreon: () => navigation.navigate('Patreon'),
  };
}

function mergeProps(stateProps, dispatchProps, ownProps) {
  const { canAccess } = stateProps;
  const { openPlayer, openItem, openPatreon } = dispatchProps;
  return {
    ...ownProps,
    ...stateProps,
    onPlay: canAccess ? openPlayer : openPatreon,
    onPress: canAccess ? openItem : openPatreon,
  };
}

export default withNavigation(
  connect(mapStateToProps, mapDispatchToProps, mergeProps)(PlayableListCard),
);
