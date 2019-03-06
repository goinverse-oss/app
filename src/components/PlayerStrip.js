import React from 'react';
import { StyleSheet, View, Text, TouchableWithoutFeedback } from 'react-native';
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
    flexDirection: 'row',
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  imageContaner: {
    width: 10,
    height: 10,
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  itemDescription: {
    flex: 1,
    marginVertical: 10,
    marginLeft: 5,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
  },
  seriesTitle: {
    marginTop: 5,
    fontSize: 10,
  },
  controls: {
    marginLeft: 'auto',
  },
  jumpButtonIconStyle: {

  },
  jumpButtonStyle: {

  },
  playButtonIconStyle: {
    fontSize: 36,
  },
  pauseButtonIconStyle: {
    marginTop: 4,
    fontSize: 36,
  },
  playbackButtonStyle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    margin: 0,
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
