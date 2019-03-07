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
  duration,
  elapsed,
  isLoading,
  isBuffering,
  seek,
  setPendingSeek,
}) => (
  <View style={[styles.container, style]}>
    <View style={styles.timesContainer}>
      <Text style={[styles.time, styles.elapsedTime]}>
        {formatDuration(elapsed)}
      </Text>
      <Text style={styles.status}>{renderStatus({ isLoading, isBuffering })}</Text>
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
  isLoading: PropTypes.bool.isRequired,
  isBuffering: PropTypes.bool.isRequired,
  seek: PropTypes.func.isRequired,
  setPendingSeek: PropTypes.func.isRequired,
};

AudioTimeline.defaultProps = {
  style: {},
  duration: moment.duration(0),
};

function mapStateToProps(state) {
  return {
    isLoading: selectors.isLoading(state),
    isBuffering: selectors.isBuffering(state),
    elapsed: moment.duration(selectors.elapsed(state)),
    duration: moment.duration(selectors.duration(state)),
  };
}

export default connect(mapStateToProps, actions)(AudioTimeline);
