import React from 'react';
import { Easing, Platform, Text, View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import TextTicker from 'react-native-text-ticker';

import { FontAwesome } from '@expo/vector-icons';

import SquareImage from '../../components/SquareImage';
import { screenRelativeWidth, screenRelativeHeight } from '../../components/utils';
import appPropTypes from '../../propTypes';
import * as actions from '../../state/ducks/playback/actions';
import * as selectors from '../../state/ducks/playback/selectors';
import { getImageSource, getSeriesTitle } from '../../state/ducks/orm/utils';
import appStyles from '../../styles';

import AudioTimeline from './AudioTimeline';
import Controls from './Controls';

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
    height: screenRelativeWidth(0.8),
    borderRadius: 4,
    flexDirection: 'column',
    position: 'absolute',
    top: screenRelativeHeight(0.05),
    maxHeight: screenRelativeHeight(0.4),
  },
  coverArtImage: {},
  mediaContainer: {
    height: 194,
    width: '95%',
    alignItems: 'center',
    position: 'absolute',
    bottom: screenRelativeHeight(0.09),
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
  },
  seriesTitle: {
    marginTop: 5,
    fontSize: 16,
    color: '#7B7B7B',
  },
  timeline: {
    marginTop: 10,
  },
  controls: {
    marginTop: 30,
  },
});

class PlayerScreen extends React.Component {
  componentDidUpdate(prevProps) {
    const { item: prevItem } = prevProps;
    const { navigation, item } = this.props;
    if (prevItem && !item) {
      navigation.goBack(null);
    }
  }

  render() {
    const { item } = this.props;

    return (
      <View style={appStyles.container}>
        <View style={styles.imageContainer}>
          {
            item ? (
              <SquareImage
                source={getImageSource(item)}
                width={0.8}
                style={styles.coverArtImage}
              />
            ) : null
          }
        </View>
        <View style={styles.mediaContainer}>
          <TextTicker
            style={styles.title}
            scrollSpeed={25}
            marqueeDelay={2000}
            easing={Easing.linear}
          >
            {item ? item.title : ''}
          </TextTicker>
          <Text style={styles.seriesTitle}>{getSeriesTitle(item)}</Text>
          <AudioTimeline style={styles.timeline} />
          <Controls style={styles.controls} />
        </View>
      </View>
    );
  }
}

PlayerScreen.propTypes = {
  navigation: appPropTypes.navigation.isRequired,
  item: appPropTypes.mediaItem,
};

PlayerScreen.defaultProps = {
  item: null,
};

PlayerScreen.navigationOptions = ({ navigation }) => ({
  headerLeft: () => (
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
    isPaused: selectors.isPaused(state),
  };
}

export default connect(mapStateToProps, actions)(PlayerScreen);
