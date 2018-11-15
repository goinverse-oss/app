import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Platform, Text, View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { connect } from 'react-redux';

import { MaterialIcons, FontAwesome, Foundation, AntDesign } from '@expo/vector-icons';

import SquareImage from '../../components/SquareImage';
import { screenRelativeWidth } from '../../components/utils';
import appPropTypes from '../../propTypes';
import * as actions from '../../state/ducks/playback/actions';
import * as selectors from '../../state/ducks/playback/selectors';
import appStyles from '../../styles';

import AudioTimeline from './AudioTimeline';

const shadowRadius = 6;

const styles = StyleSheet.create({
  closeIcon: {
    fontSize: 24,
    paddingHorizontal: 10,
  },
  imageContainer: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: {
          height: 2,
        },
        shadowRadius,
      },
      android: {
        elevation: 3,
      },
    }),
    flex: 1,
    marginTop: 30,
    borderRadius: 4,
  },
  mediaContainer: {
    width: '100%',
    height: '40%',
    marginTop: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  seriesTitle: {
    marginTop: 5,
    fontSize: 13,
  },
  timeline: {
    marginTop: 10,
  },
  controls: {
    marginTop: 20,
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
    fontSize: 10,
    bottom: 10,
  },
});

function getSeriesTitle(item) {
  const group = ['category', 'podcast', 'liturgy'].find(g => _.has(item, g));
  return _.isUndefined(group) ? null : item[group].title;
}

const PlaybackButton = ({ isPaused, onPress }) => (
  <TouchableWithoutFeedback onPress={onPress}>
    <View style={styles.playbackButton}>
      {
        isPaused
          ? <Foundation name="play" style={styles.playIcon} />
          : <AntDesign name="pause" style={styles.pauseIcon} />
      }
    </View>
  </TouchableWithoutFeedback>
);

PlaybackButton.propTypes = {
  isPaused: PropTypes.bool.isRequired,
  onPress: PropTypes.func.isRequired,
};

const JumpIcon = ({
  jumpSeconds,
}) => (
  <View style={styles.jumpIconContainer}>
    <MaterialIcons
      style={styles.jumpIcon}
      name={`fast-${jumpSeconds > 0 ? 'forward' : 'rewind'}`}
    />
    <Text
      style={[
        styles.jumpIconText,
        {
          [jumpSeconds > 0 ? 'right' : 'left']: 4,
        },
      ]}
    >
      {Math.abs(jumpSeconds)}
    </Text>
  </View>
);

JumpIcon.propTypes = {
  jumpSeconds: PropTypes.number.isRequired,
};

const JumpButton = ({
  jumpSeconds,
}) => (
  <TouchableWithoutFeedback>
    <JumpIcon jumpSeconds={jumpSeconds} />
  </TouchableWithoutFeedback>
);

JumpButton.propTypes = {
  jumpSeconds: PropTypes.number.isRequired,
};

const jumpSeconds = 30;

const PlayerScreen = ({
  item,
  isPaused,
  play,
  pause,
}) => (
  <View style={appStyles.container}>
    <View style={styles.imageContainer}>
      <SquareImage
        source={{ uri: item.imageUrl }}
        width={screenRelativeWidth(1)}
      />
    </View>
    <View style={styles.mediaContainer}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.seriesTitle}>{getSeriesTitle(item)}</Text>
      <AudioTimeline style={styles.timeline} />
      <View style={styles.controls}>
        <JumpButton jumpSeconds={-jumpSeconds} />
        <PlaybackButton
          isPaused={isPaused}
          onPress={() => (isPaused ? play(item) : pause(item))}
        />
        <JumpButton jumpSeconds={jumpSeconds} />
      </View>
    </View>
  </View>
);

PlayerScreen.propTypes = {
  item: appPropTypes.mediaItem.isRequired,
  isPaused: PropTypes.bool.isRequired,
  play: PropTypes.func.isRequired,
  pause: PropTypes.func.isRequired,
};

PlayerScreen.navigationOptions = ({ navigation }) => ({
  headerLeft: (
    <FontAwesome
      name="angle-down"
      style={styles.closeIcon}
      onPress={() => navigation.goBack(null)}
    />
  ),
  title: '',
});

function mapStateToProps(state) {
  return {
    item: selectors.item(state),
    isPlaying: selectors.isPlaying(state),
    isPaused: selectors.isPaused(state),
    elapsed: selectors.elapsed(state),
  };
}

export default connect(mapStateToProps, actions)(PlayerScreen);
