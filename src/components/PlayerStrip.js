import React from 'react';
import { StyleSheet, View, Platform, Text, TouchableWithoutFeedback } from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';

import appPropTypes from '../propTypes';

import SquareImage from '../components/SquareImage';
import Controls from '../screens/PlayerScreen/Controls';
import * as actions from '../state/ducks/playback/actions';
import * as selectors from '../state/ducks/playback/selectors';
import { getImageSource } from '../state/ducks/orm/utils';

const styles = StyleSheet.create({
  container: {
    padding: 7,
    paddingLeft: 18,
    paddingRight: 7,
    height: 50,
    flexDirection: 'row',
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    marginTop: -3,
    fontSize: 16,
    color: '#7B7B7B',
  },
  pauseButtonIconStyle: {
    marginTop: 2,
    fontSize: 16,
    color: '#7B7B7B',
  },
  playbackButtonStyle: {
    width: 25,
    height: 25,
    borderRadius: 25,
    borderColor: '#7B7B7B',
    borderWidth: 1,
  },
});

function getSeriesTitle(item) {
  const group = ['category', 'podcast', 'liturgy'].find(g => _.has(item, g));
  return _.get(item, [group, 'title']);
}

const PlayerStrip = ({ item, navigation: { navigate } }) => (
  item ? (
    <TouchableWithoutFeedback
      onPress={() => navigate('PlayerWithHeader')}
    >
      <View style={styles.container}>
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
        </View>
        <Controls
          style={styles.controls}
          jumpButtonStyle={styles.jumpButtonStyle}
          jumpButtonIconStyle={styles.jumpButtonIconStyle}
          playbackButtonStyle={styles.playbackButtonStyle}
          playButtonIconStyle={styles.playButtonIconStyle}
          pauseButtonIconStyle={styles.pauseButtonIconStyle}
        />
      </View>
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
