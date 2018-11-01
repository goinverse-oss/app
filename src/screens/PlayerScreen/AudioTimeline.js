import React from 'react';
import { View, Text, ViewPropTypes, StyleSheet } from 'react-native';

import moment from 'moment';
import momentPropTypes from 'react-moment-proptypes';

import appPropTypes from '../../propTypes';

const styles = StyleSheet.create({
  container: {
    width: '95%',
    flexDirection: 'column',
  },
  timesContainer: {
    height: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  time: {
    fontSize: 13,
    color: '#474B4E',
  },
  elapsedTime: {
    color: '#F95A57',
  },
  progressBar: {
    width: '100%',
    height: 2,
    backgroundColor: '#ccc',
  },
  playedBar: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#F95A57',
  },
});

function playedBarWidth(duration, elapsed) {
  const percent = 100 * (
    elapsed.asSeconds() / duration.asSeconds()
  );
  return {
    width: `${percent}%`,
  };
}

function formatDuration(duration) {
  return duration.format('h:mm:ss', {
    stopTrim: 'm',
  });
}

function formatRemainingTime(duration, elapsed) {
  const remaining = moment.duration(duration).subtract(elapsed);
  return `-${formatDuration(remaining)}`;
}

const AudioTimeline = ({ style, item, elapsed }) => (
  <View style={[styles.container, style]}>
    <View style={styles.timesContainer}>
      <Text style={[styles.time, styles.elapsedTime]}>{formatDuration(elapsed)}</Text>
      <Text style={styles.time}>{formatRemainingTime(item.duration, elapsed)}</Text>
    </View>
    <View style={styles.progressBar} />
    <View
      style={[
        styles.progressBar,
        styles.playedBar,
        playedBarWidth(item.duration, elapsed),
      ]}
    />
  </View>
);

AudioTimeline.propTypes = {
  style: ViewPropTypes.style,
  item: appPropTypes.mediaItem.isRequired,
  elapsed: momentPropTypes.momentDurationObj.isRequired,
};

AudioTimeline.defaultProps = {
  style: {},
};

export default AudioTimeline;
