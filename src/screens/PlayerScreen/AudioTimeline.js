import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, ViewPropTypes, StyleSheet } from 'react-native';
import Slider from 'react-native-slider';
import { connect } from 'react-redux';

import moment from 'moment';
import 'moment-duration-format';
import momentPropTypes from 'react-moment-proptypes';

import * as actions from '../../state/ducks/playback/actions';
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
  slider: {
    height: 10,
  },
  sliderThumb: {
    height: 11,
    width: 11,
    backgroundColor: '#F95A57',
  },
});

function formatDuration(duration) {
  if (!duration) {
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

function renderLoadStatus({ isLoading, isBuffering }) {
  if (isLoading) {
    return 'Loading...';
  } else if (isBuffering) {
    return 'Buffering...';
  }
  return '';
}

function renderBufferProgress({ playableDurationMillis, durationMillis }) {
  if (playableDurationMillis && durationMillis) {
    const percent = (playableDurationMillis / durationMillis) * 100;
    return `Buffered ${Math.floor(percent)}%`;
  }
  return '';
}

function renderStatus(status) {
  if (!status) {
    return '';
  }

  const loadStatus = renderLoadStatus(status);
  const bufferStatus = renderBufferProgress(status);
  if (loadStatus.length > 0) {
    return `${loadStatus}... ${bufferStatus}`;
  }
  return bufferStatus;
}

const AudioTimeline = ({
  style,
  duration,
  elapsed,
  status,
  seek,
  setPendingSeek,
}) => (
  <View style={[styles.container, style]}>
    <View style={styles.timesContainer}>
      <Text style={[styles.time, styles.elapsedTime]}>
        {formatDuration(elapsed)}
      </Text>
      <Text style={styles.status}>{renderStatus(status)}</Text>
      <Text style={styles.time}>
        {formatRemainingTime(duration, elapsed)}
      </Text>
    </View>
    <Slider
      style={styles.slider}
      thumbStyle={styles.sliderThumb}
      minimumValue={0}
      maximumValue={duration.asMilliseconds()}
      value={elapsed.asMilliseconds()}
      minimumTrackTintColor="#F95A57"
      onSlidingStart={value => setPendingSeek(moment.duration(value))}
      onValueChange={value => setPendingSeek(moment.duration(value))}
      onSlidingComplete={value => seek(moment.duration(value))}
    />
  </View>
);

AudioTimeline.propTypes = {
  style: ViewPropTypes.style,
  elapsed: momentPropTypes.momentDurationObj.isRequired,
  duration: momentPropTypes.momentDurationObj,
  status: PropTypes.shape({}),
  seek: PropTypes.func.isRequired,
  setPendingSeek: PropTypes.func.isRequired,
};

AudioTimeline.defaultProps = {
  style: {},
  duration: moment.duration(0),
  status: {},
};

function mapStateToProps(state) {
  return {
    elapsed: moment.duration(selectors.elapsed(state)),
    duration: moment.duration(selectors.duration(state)),
    status: selectors.getStatus(state),
  };
}

export default connect(mapStateToProps, actions)(AudioTimeline);
