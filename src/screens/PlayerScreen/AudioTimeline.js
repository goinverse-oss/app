import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, ViewPropTypes, StyleSheet } from 'react-native';
import Slider from '@brlja/react-native-slider';
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

function formatDurationForSpeech(duration) {
  if (!duration) {
    return 'none';
  }

  const components = [`${duration.seconds()} seconds`];
  if (duration.minutes() > 0) {
    components.unshift(`${duration.minutes()} minutes`);
  }
  if (duration.hours() > 0) {
    components.unshift(`${duration.hours()} hours`);
  }
  return components.join(', ');
}

const AudioTimeline = ({
  style,
  duration,
  elapsed,
  status,
  seek,
  jump,
  setPendingSeek,
}) => {
  const largeSkipMinutes = 5;

  // TODO: make this accessible after upgrading to React Native >= 0.60
  // eslint-disable-next-line
  const onAccessibilityAction = (event) => {
    switch (event.nativeEvent.actionName) {
      case 'increment':
        jump(largeSkipMinutes * 60);
        break;
      case 'decrement':
        jump(-largeSkipMinutes * 60);
        break;
      default:
        break;
    }
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.timesContainer}>
        <Text
          style={[styles.time, styles.elapsedTime]}
          accessibilityLabel={`Elapsed: ${formatDurationForSpeech(elapsed)}`}
        >
          {formatDuration(elapsed)}
        </Text>
        <Text style={styles.status}>{renderStatus(status)}</Text>
        <Text
          style={styles.time}
          accessibilityLabel={
            `Remaining: ${formatDurationForSpeech(moment.duration(duration).subtract(elapsed))}`
          }
        >
          {formatRemainingTime(duration, elapsed)}
        </Text>
      </View>
      <Slider
        // accessible
        // accessibilityLabel="Playback progress"
        // accessibilityHint={`Activate to seek ${largeSkipMinutes} minutes at a time`}
        // accessiblityRole="adjustable"
        // accessibilityActions={[
        //   { name: 'increment', label: `Skip forward ${largeSkipMinutes} minutes` },
        //   { name: 'decrement', label: `Skip back ${largeSkipMinutes} minutes` },
        // ]}
        // onAccessibilityAction={onAccessibilityAction}
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
};

AudioTimeline.propTypes = {
  style: ViewPropTypes.style,
  elapsed: momentPropTypes.momentDurationObj.isRequired,
  duration: momentPropTypes.momentDurationObj,
  status: PropTypes.shape({}),
  seek: PropTypes.func.isRequired,
  jump: PropTypes.func.isRequired,
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
