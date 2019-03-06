import React from 'react';
import _ from 'lodash';
import { Platform, Text, View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';

import { FontAwesome } from '@expo/vector-icons';

import SquareImage from '../../components/SquareImage';
import { screenRelativeWidth } from '../../components/utils';
import appPropTypes from '../../propTypes';
import * as actions from '../../state/ducks/playback/actions';
import * as selectors from '../../state/ducks/playback/selectors';
import { getImageSource } from '../../state/ducks/orm/utils';
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
  },
});

function getSeriesTitle(item) {
  const group = ['category', 'podcast', 'liturgy'].find(g => _.has(item, g));
  return _.get(item, [group, 'title']);
}

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
                width={screenRelativeWidth(1)}
              />
            ) : null
          }
        </View>
        <View style={styles.mediaContainer}>
          <Text style={styles.title}>{item ? item.title : ''}</Text>
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
    isPaused: selectors.isPaused(state),
  };
}

export default connect(mapStateToProps, actions)(PlayerScreen);
