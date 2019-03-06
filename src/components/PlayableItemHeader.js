import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import moment from 'moment';
import { ViewPropTypes, View, Text, StyleSheet } from 'react-native';
import { normalize } from 'react-native-elements';

import PlayButton from './PlayButton';
import SquareImage from './SquareImage';
import { formatMinutesString, screenRelativeWidth } from './utils';

import AppPropTypes from '../propTypes';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  imageContainer: {
    width: '30%',
    marginRight: 20,
  },
  metadataContainer: {
    justifyContent: 'space-around',
    flex: 1,
  },
  title: {
    fontSize: normalize(15),
    fontWeight: '600',
  },
  times: {
    fontSize: normalize(12),
    color: '#797979',
  },
});

function formatFooter({
  duration, publishedAt, formatDuration, formatPublishedAt,
}) {
  const separator = ' • ';
  const strings = [];
  if (!_.isNull(duration)) {
    strings.push(formatDuration(duration));
  }
  if (!_.isNull(publishedAt)) {
    strings.push(formatPublishedAt(publishedAt));
  }
  return strings.join(separator);
}

const PlayableItemHeader = ({
  coverImageSource,
  style,
  title,
  duration,
  publishedAt,
  onPlay,
  formatDuration,
  formatPublishedAt,
  ...props
}) => (
  <View style={[styles.container, style]} {...props}>
    <View style={styles.imageContainer}>
      <SquareImage
        source={coverImageSource}
        width={screenRelativeWidth(0.3)}
      />
    </View>
    <View style={styles.metadataContainer}>
      <Text style={styles.title} numberOfLines={1}>{title}</Text>
      <Text style={styles.times}>
        {formatFooter({
          duration, publishedAt, formatDuration, formatPublishedAt,
        })}
      </Text>
      <PlayButton onPress={onPlay} text="Listen" />
    </View>
  </View>
);

PlayableItemHeader.propTypes = {
  coverImageSource: AppPropTypes.imageSource.isRequired,
  style: ViewPropTypes.style,
  title: PropTypes.string.isRequired,
  duration: PropTypes.string,
  publishedAt: PropTypes.string,
  onPlay: PropTypes.func,
  formatDuration: PropTypes.func,
  formatPublishedAt: PropTypes.func,
};

PlayableItemHeader.defaultProps = {
  style: {},
  duration: null,
  publishedAt: null,
  onPlay: () => {},
  formatDuration: formatMinutesString,
  formatPublishedAt: publishedAt => `${moment(publishedAt).fromNow()}`,
};

export default PlayableItemHeader;
