import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Dimensions, View, Text, StyleSheet } from 'react-native';
import { normalize } from 'react-native-elements';
import momentPropTypes from 'react-moment-proptypes';

import PlayButton from './PlayButton';
import InteractionsCounter from './InteractionsCounter';
import SquareImage from './SquareImage';
import { formatMinutesString } from './utils';

import AppPropTypes from '../propTypes';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginHorizontal: 15,
  },
  imageContainer: {
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
  duration, publishDate, formatDuration, formatPublishDate,
}) {
  const separator = ' • ';
  const strings = [];
  if (!_.isNull(duration)) {
    strings.push(formatDuration(duration));
  }
  if (!_.isNull(publishDate)) {
    strings.push(formatPublishDate(publishDate));
  }
  return strings.join(separator);
}

function screenRelativeWidth(fraction) {
  const { width } = Dimensions.get('window');
  return width * fraction;
}

const PlayableItemHeader = ({
  coverImageSource,
  style,
  title,
  duration,
  publishDate,
  onPlay,
  formatDuration,
  formatPublishDate,
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
          duration, publishDate, formatDuration, formatPublishDate,
        })}
      </Text>
      <InteractionsCounter />
      <PlayButton onPress={onPlay} text="Listen" />
    </View>
  </View>
);

PlayableItemHeader.propTypes = {
  coverImageSource: AppPropTypes.imageSource.isRequired,
  style: View.propTypes.style,
  title: PropTypes.string.isRequired,
  duration: momentPropTypes.momentDurationObj,
  publishDate: momentPropTypes.momentObj,
  onPlay: PropTypes.func,
  formatDuration: PropTypes.func,
  formatPublishDate: PropTypes.func,
};

PlayableItemHeader.defaultProps = {
  style: {},
  duration: null,
  publishDate: null,
  onPlay: () => {},
  formatDuration: formatMinutesString,
  formatPublishDate: m => `${m.fromNow()}`,
};

export default PlayableItemHeader;
