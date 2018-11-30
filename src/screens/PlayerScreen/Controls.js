import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  StyleSheet,
  TouchableWithoutFeedback,
  Text,
  View,
  ViewPropTypes,
} from 'react-native';
import { MaterialIcons, Foundation, AntDesign } from '@expo/vector-icons';

import appPropTypes from '../../propTypes';

import * as actions from '../../state/ducks/playback/actions';
import * as selectors from '../../state/ducks/playback/selectors';

const styles = StyleSheet.create({
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playbackButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: 80,
    borderRadius: 40,
    borderColor: '#000',
    borderWidth: 2,
    margin: 10,
  },
  playIcon: {
    paddingTop: 4,
    paddingLeft: 2,
    fontSize: 48,
  },
  pauseIcon: {
    fontSize: 48,
  },
  jumpIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  jumpIcon: {
    fontSize: 56,
  },
  jumpIconText: {
    position: 'absolute',
    fontSize: 12,
    bottom: 17,
    backgroundColor: '#fff',
  },
});

const PlaybackButton = ({
  isPaused,
  onPress,
  style,
  playButtonIconStyle,
  pauseButtonIconStyle,
}) => (
  <TouchableWithoutFeedback onPress={onPress}>
    <View style={[styles.playbackButton, style]}>
      {
        isPaused
          ? <Foundation name="play" style={[styles.playIcon, playButtonIconStyle]} />
          : <AntDesign name="pause" style={[styles.pauseIcon, pauseButtonIconStyle]} />
      }
    </View>
  </TouchableWithoutFeedback>
);

PlaybackButton.propTypes = {
  isPaused: PropTypes.bool.isRequired,
  onPress: PropTypes.func.isRequired,
  style: ViewPropTypes.style,
  playButtonIconStyle: appPropTypes.iconStyle,
  pauseButtonIconStyle: appPropTypes.iconStyle,
};

PlaybackButton.defaultProps = {
  style: {},
  playButtonIconStyle: {},
  pauseButtonIconStyle: {},
};

const JumpIcon = ({
  jumpSeconds,
  style,
}) => (
  <View style={[styles.jumpIconContainer, style]}>
    <MaterialIcons
      style={styles.jumpIcon}
      name={`${jumpSeconds > 0 ? 'forward-5' : 'replay'}`}
    />
    <Text
      style={[
        styles.jumpIconText,
      ]}
    >
      {Math.abs(jumpSeconds)}
    </Text>
  </View>
);

JumpIcon.propTypes = {
  style: ViewPropTypes.style,
  jumpSeconds: PropTypes.number.isRequired,
};

JumpIcon.defaultProps = {
  style: {},
};

let JumpButton = ({
  jumpSeconds,
  jump,
  iconStyle,
}) => (
  <TouchableWithoutFeedback
    onPress={() => { jump(jumpSeconds); }}
  >
    <View>
      <JumpIcon style={iconStyle} jumpSeconds={jumpSeconds} />
    </View>
  </TouchableWithoutFeedback>
);

JumpButton.propTypes = {
  jumpSeconds: PropTypes.number.isRequired,
  jump: PropTypes.func.isRequired,
  iconStyle: appPropTypes.iconStyle,
};

JumpButton.defaultProps = {
  iconStyle: {},
};

JumpButton = connect(null, actions)(JumpButton);

const jumpSeconds = 30;


const Controls = ({
  item,
  isPaused,
  play,
  pause,
  style,
  jumpButtonStyle,
  jumpButtonIconStyle,
  playbackButtonStyle,
  playButtonIconStyle,
  pauseButtonIconStyle,
}) => (
  <View style={[styles.controls, style]}>
    <JumpButton
      style={jumpButtonStyle}
      iconStyle={jumpButtonIconStyle}
      jumpSeconds={-jumpSeconds}
    />
    <PlaybackButton
      style={playbackButtonStyle}
      playButtonIconStyle={playButtonIconStyle}
      pauseButtonIconStyle={pauseButtonIconStyle}
      isPaused={isPaused}
      onPress={() => (isPaused ? play(item) : pause(item))}
    />
    <JumpButton
      style={jumpButtonStyle}
      iconStyle={jumpButtonIconStyle}
      jumpSeconds={jumpSeconds}
    />
  </View>
);

Controls.propTypes = {
  item: appPropTypes.mediaItem.isRequired,
  isPaused: PropTypes.bool.isRequired,
  play: PropTypes.func.isRequired,
  pause: PropTypes.func.isRequired,
  style: ViewPropTypes.style,
  jumpButtonStyle: ViewPropTypes.style,
  playbackButtonStyle: ViewPropTypes.style,
  jumpButtonIconStyle: appPropTypes.iconStyle,
  playButtonIconStyle: appPropTypes.iconStyle,
  pauseButtonIconStyle: appPropTypes.iconStyle,
};

Controls.defaultProps = {
  style: {},
  jumpButtonStyle: {},
  jumpButtonIconStyle: {},
  playbackButtonStyle: {},
  playButtonIconStyle: {},
  pauseButtonIconStyle: {},
};

function mapStateToProps(state) {
  return {
    item: selectors.item(state),
    isPaused: selectors.isPaused(state),
  };
}

export default connect(mapStateToProps, actions)(Controls);
