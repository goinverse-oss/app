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
import Icon from '@expo/vector-icons/Foundation';
import pluralize from 'pluralize';

import ListCard from './ListCard';
import SquareImage from './SquareImage';
import TextPill from './TextPill';
import { formatMinutesString } from './utils';

import appPropTypes from '../propTypes';
import * as actions from '../state/ducks/playback/actions';

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
    fontSize: 15,
    fontWeight: '600',
  },
  description: {
    fontSize: 12,
    color: '#797979',
    minHeight: '45%',
    marginVertical: '2%',
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
  },
  mediaType: {
    marginRight: '3%',
  },
});

function formatFooter({ duration, publishedAt, formatDuration }) {
  const separator = ' • ';
  const strings = [];
  if (duration) {
    strings.push(formatDuration(duration));
  }
  if (!_.isUndefined(publishedAt)) {
    strings.push(publishedAt.fromNow());
  }
  return strings.join(separator);
}

const PlayableListCard = ({
  style,
  formatDuration,
  isSearchResult,
  navigation,
  item,
  play,
  ...props
}) => (
  <ListCard style={[styles.card, style]} {...props}>
    <TouchableWithoutFeedback onPress={() => play()}>
      <View style={styles.imageContainer} >
        <SquareImage
          source={{ uri: item.imageUrl }}
          width={86}
          style={styles.image}
        />
        <Icon name="play" style={styles.playIcon} />
        <View style={styles.playCircle} />
      </View>
    </TouchableWithoutFeedback>
    <View style={styles.metadataContainer}>
      {isSearchResult ? (
        <View style={styles.searchHeader}>
          <TextPill style={styles.mediaType}>{pluralize.singular(item.type)}</TextPill>
          <Text style={styles.times}>
            {formatFooter({ ...item, formatDuration })}
          </Text>
        </View>
      ) : null}
      <View style={styles.textContainer}>
        <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
        <Text
          style={[
            styles.description,
            (isSearchResult ? { minHeight: 0 } : {}),
          ]}
          numberOfLines={2}
        >
          {item.description}
        </Text>
      </View>
      {isSearchResult ? null : (
        <View style={styles.footer}>
          <Text style={styles.times}>
            {formatFooter({ ...item, formatDuration })}
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
  formatDuration: PropTypes.func,
  isSearchResult: PropTypes.bool,
  play: PropTypes.func.isRequired,
};

PlayableListCard.defaultProps = {
  style: {},
  formatDuration: formatMinutesString,
  isSearchResult: false,
};

function mapDispatchToProps(dispatch, { navigation, item }) {
  return {
    play: () => {
      dispatch(
        actions.setPlaying(
          _.pick(item, ['type', 'id']),
        ),
      );
      navigation.navigate('Player');
    },
  };
}

export default withNavigation(
  connect(null, mapDispatchToProps)(PlayableListCard),
);
