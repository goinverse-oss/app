import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Animated, StyleSheet, Dimensions, Platform, View } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import { createBottomTabNavigator, BottomTabBar } from 'react-navigation-tabs';
import { connect } from 'react-redux';
import DropdownAlert from 'react-native-dropdownalert';
import { GestureHandler, LinearGradient } from 'expo';

import HomeScreen from '../screens/HomeScreen';
import PatreonScreen from '../screens/PatreonScreen';
import PlayerScreen from '../screens/PlayerScreen';
import PlayerStrip from '../components/PlayerStrip';
import PodcastsScreen from '../screens/PodcastsScreen';
import PodcastScreen from '../screens/PodcastScreen';
import SinglePodcastEpisodeScreen from '../screens/SinglePodcastEpisodeScreen';
import MeditationsScreen from '../screens/MeditationsScreen';
import MeditationsCategoryScreen from '../screens/MeditationsCategoryScreen';
import SingleMeditationScreen from '../screens/SingleMeditationScreen';
import DrawerContent from '../navigation/DrawerContent';
import MeditationsIcon from '../screens/MeditationsIcon';
import PodcastsIcon from '../screens/PodcastsIcon';
import HomeIcon from '../screens/HomeIcon';

const { DrawerLayout } = GestureHandler;

const HomeNavigator = createStackNavigator({
  Home: HomeScreen,
}, {
  navigationOptions: {
    tabBarIcon: HomeIcon,
  },
});

const PodcastsNavigator = createStackNavigator({
  Podcasts: PodcastsScreen,
  Podcast: PodcastScreen,
  SinglePodcastEpisode: SinglePodcastEpisodeScreen,
}, {
  navigationOptions: {
    tabBarIcon: MeditationsIcon,
  },
});

PodcastsNavigator.navigationOptions = {
  tabBarIcon: PodcastsIcon,
};

const MeditationsNavigator = createStackNavigator({
  AllMeditationCategories: MeditationsScreen,
  MeditationsCategory: MeditationsCategoryScreen,
  SingleMeditation: SingleMeditationScreen,
}, {
  navigationOptions: {
    tabBarIcon: MeditationsIcon,
  },
});

MeditationsNavigator.navigationOptions = {
  tabBarIcon: MeditationsIcon,
};

const TabBar = props => (
  <View>
    <PlayerStrip navigation={props.navigation} />
    <BottomTabBar {...props} />
  </View>
);

const Tabs = createBottomTabNavigator({
  Home: { screen: HomeNavigator },
  Podcasts: { screen: PodcastsNavigator },
  Meditations: { screen: MeditationsNavigator },
}, {
  tabBarComponent: TabBar,
  tabBarOptions: {
    activeTintColor: '#F95A57',
    inactiveTintColor: '#D2D2D2',
    style: {
      borderTopWidth: 0,
      padding: 5,

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
    labelStyle: {
      fontWeight: '600',
    },
  },
});

// hack to get the header to appear (it doesn't with a TabNavigator)
const PatreonWithHeader = createStackNavigator({
  PatreonWithHeader: { screen: PatreonScreen },
});

const PlayerWithHeader = createStackNavigator({
  PlayerWithHeader: { screen: PlayerScreen },
});

const Modals = createStackNavigator(
  {
    Main: { screen: Tabs },
    Patreon: { screen: PatreonWithHeader },
    Player: { screen: PlayerWithHeader },
  },
  {
    mode: 'modal',
    headerMode: 'none',
  },
);

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
});

/**
 * Navigator for the main "logged-in" user flow.
 */
class MainNavigator extends React.Component {
  static router = Modals.router;

  constructor() {
    super();
    // XXX: handle device rotation or multitasking resize?
    this.listening = false;
    this.windowDimensions = Dimensions.get('window');
    this.state = {
      drawer: null,
    };
    this.dropDown = null;
  }

  getAnimatedStyles(progressValue) {
    if (Platform.OS === 'android') {
      // don't animate on Android, because we're doing the
      // default drawer-in-front styling... for now.
      return {};
    }

    const margin = progressValue
      ? progressValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, this.windowDimensions.height * 0.05],
      })
      : 0;
    return {
      paddingVertical: margin,
    };
  }

  render() {
    const { apiError } = this.props;
    if (apiError && this.dropDown) {
      this.dropDown.alertWithType(
        'error',
        apiError.message || 'Error',
        [
          `URL: ${apiError.config.url}`,
          _.get(apiError, 'request._response', ''),
        ].join('\n'),
      );
    }

    return (
      <LinearGradient style={styles.gradient} colors={['#FFFFFF00', '#F95A570C']}>
        <DrawerLayout
          ref={drawer => (!this.state.drawer && this.setState({ drawer }))}
          renderNavigationView={() => <DrawerContent drawer={this.state.drawer} />}
          drawerWidth={this.windowDimensions.width * 0.75}
          {
            ...Platform.select({
              ios: {
                drawerType: 'back',
                overlayColor: '#00000000',
              },
              android: {},
            })
          }
          useNativeAnimations={false}
        >
          {
            progressValue => (
              <Animated.View
                style={[styles.container, this.getAnimatedStyles(progressValue)]}
              >
                <Modals
                  screenProps={{ drawer: this.state.drawer }}
                  navigation={this.props.navigation}
                />
                <DropdownAlert
                  ref={(ref) => { this.dropDown = ref; }}
                  messageNumOfLines={10}
                />
              </Animated.View>
            )
          }
        </DrawerLayout>
      </LinearGradient>
    );
  }
}

MainNavigator.propTypes = {
  // react-navigation internal navigation state object
  navigation: PropTypes.shape({}).isRequired,
  apiError: PropTypes.shape({}),
};

MainNavigator.defaultProps = {
  apiError: null,
};

function mapStateToProps(state) {
  return {
    apiError: _.get(
      state,
      'orm.api.error',
      _.get(state, 'patreon.error'),
    ),
  };
}

export default connect(mapStateToProps)(MainNavigator);
