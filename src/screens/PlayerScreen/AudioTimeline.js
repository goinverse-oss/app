import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, ViewPropTypes, StyleSheet } from 'react-native';
import { connect } from 'react-redux';

import _ from 'lodash';
import moment from 'moment';
import 'moment-duration-format';
import momentPropTypes from 'react-moment-proptypes';

import appPropTypes from '../../propTypes';
import * as selectors from '../../state/ducks/playback/selectors';

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
  status: {
    fontSize: 13,
    color: '#ccc',
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
  if (_.isUndefined(duration)) {
    return '--:--';
  }

  return duration.format('h:mm:ss', {
    stopTrim: 'm',
  });
}

function formatRemainingTime(duration, elapsed) {
  const remaining = moment.duration(duration).subtract(elapsed);
  return `-${formatDuration(remaining)}`;
}

function renderStatus({ isLoading, isBuffering }) {
  if (isLoading) {
    return 'Loading...';
  } else if (isBuffering) {
    return 'Buffering...';
  }
  return '';
}

const AudioTimeline = ({
  style,
  item,
  elapsed,
  isLoading,
  isBuffering,
}) => (
  <View style={[styles.container, style]}>
    <View style={styles.timesContainer}>
      <Text style={[styles.time, styles.elapsedTime]}>{formatDuration(elapsed)}</Text>
      <Text style={styles.status}>{renderStatus({ isLoading, isBuffering })}</Text>
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
  isLoading: PropTypes.bool.isRequired,
  isBuffering: PropTypes.bool.isRequired,
};

AudioTimeline.defaultProps = {
  style: {},
};

function mapStateToProps(state) {
  return {
    item: selectors.item(state),
    isLoading: selectors.isLoading(state),
    isBuffering: selectors.isBuffering(state),
    elapsed: selectors.elapsed(state),
  };
}

export default connect(mapStateToProps)(AudioTimeline);
