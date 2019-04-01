import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { ViewPropTypes, View, Text, StyleSheet } from 'react-native';
import momentPropTypes from 'react-moment-proptypes';

import PlayButton from './PlayButton';
import SquareImage from './SquareImage';
import {
  formatFooter,
  formatMinutesString,
  formatHumanizeFromNow,
  screenRelativeWidth,
} from './utils';

import AppPropTypes from '../propTypes';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  imageContainer: {
    width: '30%',
    marginRight: 28,
  },
  metadataContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  times: {
    fontSize: 12,
    color: '#797979',
    marginTop: 5,
    flex: 2,
  },
});

const PlayableItemHeader = ({
  coverImageSource,
  style,
  title,
  duration,
  publishedAt,
  elapsed,
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
      <Text style={styles.title} numberOfLines={2}>{title}</Text>
      <Text style={styles.times}>
        {formatFooter({
          duration, elapsed, publishedAt, formatDuration, formatPublishedAt,
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
  elapsed: momentPropTypes.momentDurationObj,
  onPlay: PropTypes.func,
  formatDuration: PropTypes.func,
  formatPublishedAt: PropTypes.func,
};

PlayableItemHeader.defaultProps = {
  style: {},
  duration: null,
  publishedAt: null,
  elapsed: moment.duration(),
  onPlay: () => {},
  formatDuration: formatMinutesString,
  formatPublishedAt: formatHumanizeFromNow,
};

export default PlayableItemHeader;
