import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Platform, Text, View, Button, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import Icon from '@expo/vector-icons/FontAwesome';
import momentPropTypes from 'react-moment-proptypes';

import SquareImage from '../components/SquareImage';
import { screenRelativeWidth } from '../components/utils';
import appPropTypes from '../propTypes';
import * as actions from '../state/ducks/playback/actions';
import * as selectors from '../state/ducks/playback/selectors';
import appStyles from '../styles';

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
    marginTop: '6%',
  },
  mediaContainer: {
    height: '40%',
    marginTop: '6%',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  seriesTitle: {
    marginTop: '1%',
    fontSize: 13,
  },
});

function getSeriesTitle(item) {
  const group = ['category', 'podcast', 'liturgy'].find(g => _.has(item, g));
  return _.isUndefined(group) ? null : item[group].title;
}

const PlayerScreen = ({ item }) => (
  <View style={appStyles.container}>
    <View style={styles.imageContainer}>
      <SquareImage
        source={{ uri: item.imageUrl }}
        width={screenRelativeWidth(0.9)}
      />
    </View>
    <View style={styles.mediaContainer}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.seriesTitle}>{getSeriesTitle(item)}</Text>
    </View>
  </View>
);

PlayerScreen.propTypes = {
  item: appPropTypes.mediaItem.isRequired,
  isPlaying: PropTypes.bool.isRequired,
  isPaused: PropTypes.bool.isRequired,
  elapsed: momentPropTypes.momentDurationObj.isRequired,
};

PlayerScreen.navigationOptions = ({ navigation }) => ({
  headerLeft: (
    <Icon
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
