import React from 'react';
import { StyleSheet, View, Platform, Text, TouchableWithoutFeedback } from 'react-native';
import { connect } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';

import appPropTypes from '../propTypes';

import SquareImage from '../components/SquareImage';
import Controls from '../screens/PlayerScreen/Controls';
import * as actions from '../state/ducks/playback/actions';
import * as selectors from '../state/ducks/playback/selectors';
import { getImageSource, getGroupField, getSeriesTitle } from '../state/ducks/orm/utils';

const styles = StyleSheet.create({
  container: {
    padding: 7,
    paddingHorizontal: 18,
    height: 50,
    flexDirection: 'row',
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.11,
        shadowOffset: { width: 0, height: -3 },
        shadowRadius: 21,
      },
      android: {
        elevation: 100,
        zIndex: 100,
      },
    }),
  },
  imageContainer: {
    width: 30,
    height: 30,
    alignSelf: 'center',
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  itemDescription: {
    flex: 1,
    marginVertical: 10,
    textAlign: 'center',
    marginHorizontal: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: -2,
  },
  seriesTitle: {
    marginTop: 2,
    fontSize: 10,
    textAlign: 'center',
  },
  controls: {
    marginLeft: 'auto',
  },
  jumpButtonIconStyle: {
    display: 'none',
  },
  jumpButtonStyle: {
    height: 0,
    width: 0,
  },
  playButtonIconStyle: {
    marginTop: -2,
    marginLeft: -2,
    fontSize: 16,
    color: '#7B7B7B',
  },
  pauseButtonIconStyle: {
    // Mysteriously, the centering of this icon in its container
    // seems to be different between iOS and Android. So, give it
    // a nudge downward on iOS.
    ...Platform.select({
      ios: {
        marginTop: 2,
      },
    }),
    marginLeft: 1,
    fontSize: 16,
    color: '#7B7B7B',
  },
  playbackButtonStyle: {
    width: 30,
    height: 30,
    borderRadius: 30,
    borderColor: '#7B7B7B',
    borderWidth: 1,
    marginLeft: 0,
    marginRight: 0,
  },
});

const PlayerStripContainer = ({ children, ...props }) => (
  Platform.select({
    ios: <View style={styles.container} {...props}>{children}</View>,
    android: (
      <LinearGradient
        style={styles.container}
        colors={['#fbf9fa', '#e5e5e5']}
        {...props}
      >
        {children}
      </LinearGradient>
    ),
  })
);

function getAccessibilityLabel(item) {
  const group = getGroupField(item);
  if (!group) {
    return item.title;
  }

  const seriesTitle = getSeriesTitle(item);
  return `${item.title}, from the ${group}: ${seriesTitle}`;
}

const PlayerStrip = ({ item, navigation: { navigate } }) => (
  item ? (
    <TouchableWithoutFeedback
      accessibilityLabel={`Now Playing: ${getAccessibilityLabel(item)}`}
      accessibilityHint="Tap to open Now Playing screen"
      onPress={() => navigate('PlayerWithHeader')}
    >
      <PlayerStripContainer>
        <View style={styles.item}>
          <View style={styles.imageContainer}>
            <SquareImage
              source={getImageSource(item)}
              width={10}
            />
          </View>
          <View style={styles.itemDescription}>
            <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
            <Text style={styles.seriesTitle} numberOfLines={1}>{getSeriesTitle(item)}</Text>
          </View>
          {/* XXX: this can be simplified to just use the PlaybackButton instead. */}
          <Controls
            style={styles.controls}
            jumpButtonStyle={styles.jumpButtonStyle}
            jumpButtonIconStyle={styles.jumpButtonIconStyle}
            playbackButtonStyle={styles.playbackButtonStyle}
            playButtonIconStyle={styles.playButtonIconStyle}
            pauseButtonIconStyle={styles.pauseButtonIconStyle}
          />
        </View>
      </PlayerStripContainer>
    </TouchableWithoutFeedback>
  ) : null
);


PlayerStrip.propTypes = {
  navigation: appPropTypes.navigation.isRequired,
  item: appPropTypes.mediaItem,
};

PlayerStrip.defaultProps = {
  item: null,
};

function mapStateToProps(state) {
  return {
    item: selectors.item(state),
    isPaused: selectors.isPaused(state),
  };
}

export default connect(mapStateToProps, actions)(PlayerStrip);
