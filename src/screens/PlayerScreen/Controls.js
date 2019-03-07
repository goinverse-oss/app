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
    width: 64,
    height: 64,
    borderRadius: 40,
    borderColor: '#7B7B7B',
    borderWidth: 4,
    marginLeft: 30,
    marginRight: 30,
  },
  playIcon: {
    paddingTop: 4,
    paddingLeft: 5,
    fontSize: 36,
    color: '#7B7B7B',
  },
  pauseIcon: {
    fontSize: 48,
    color: '#7B7B7B',
    marginTop: 4,
  },
  jumpIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  jumpIcon: {
    fontSize: 44,
    color: '#7B7B7B',
  },
  jumpIconText: {
    position: 'absolute',
    fontSize: 10,
    bottom: 13,
    backgroundColor: '#fff',
    color: '#7B7B7B',
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
      disabled={!item}
    />
    <PlaybackButton
      style={playbackButtonStyle}
      playButtonIconStyle={playButtonIconStyle}
      pauseButtonIconStyle={pauseButtonIconStyle}
      isPaused={isPaused}
      onPress={() => (isPaused ? play(item) : pause(item))}
      disabled={!item}
    />
    <JumpButton
      style={jumpButtonStyle}
      iconStyle={jumpButtonIconStyle}
      jumpSeconds={jumpSeconds}
      disabled={!item}
    />
  </View>
);

Controls.propTypes = {
  item: appPropTypes.mediaItem,
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
  item: null,
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
