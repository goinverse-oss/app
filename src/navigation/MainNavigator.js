import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Platform, View, useWindowDimensions } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator, BottomTabBar } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import DropdownAlert from 'react-native-dropdownalert';
import { FontAwesome } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import PatreonScreen from '../screens/PatreonScreen';
import PatreonAuthScreen from '../screens/PatreonAuthScreen';
import PlayerScreen from '../screens/PlayerScreen';
import PlayerStrip from '../components/PlayerStrip';
import PodcastsScreen from '../screens/PodcastsScreen';
import PodcastScreen from '../screens/PodcastScreen';
import SinglePodcastEpisodeScreen from '../screens/SinglePodcastEpisodeScreen';
import MeditationsScreen from '../screens/MeditationsScreen';
import MeditationsCategoryScreen from '../screens/MeditationsCategoryScreen';
import SingleMeditationScreen from '../screens/SingleMeditationScreen';
import LiturgiesScreen from '../screens/LiturgiesScreen';
import LiturgyScreen, { getLiturgyScreenOptions } from '../screens/LiturgyScreen';
import SingleLiturgyItemScreen from '../screens/SingleLiturgyItemScreen';
import ContributorScreen, { getContributorScreenOptions } from '../screens/ContributorScreen';
import SearchResultsScreen, { getSearchResultsScreenOptions } from '../screens/SearchResultsScreen';
import CommunityScreen from '../screens/CommunityScreen';
import HangoutScreen from '../screens/HangoutScreen';
import BackButton from '../navigation/BackButton';
import CloseButton from '../navigation/CloseButton';
import FeedButton from '../components/FeedButton';
import DrawerContent from '../navigation/DrawerContent';
import MeditationsIcon from '../screens/MeditationsIcon';
import PodcastsIcon from '../screens/PodcastsIcon';
import LiturgiesIcon from '../screens/LiturgiesIcon';
import HomeIcon from '../screens/HomeIcon';
import { getCommonNavigationOptions } from '../navigation/common';

import colors from '../styles/colors';

import { setDropdown } from '../showError';

const HomeStack = createStackNavigator();

const HomeNavigator = () => (
  <HomeStack.Navigator>
    <HomeStack.Screen
      name="Home"
      component={HomeScreen}
      options={{
        ...getCommonNavigationOptions(),
        headerTitle: 'The Liturgists',
      }}
    />
  </HomeStack.Navigator>
);

const PodcastsStack = createStackNavigator();
const PodcastsNavigator = () => (
  <PodcastsStack.Navigator screenOptions={{ headerTitleAlign: 'center' }}>
    <PodcastsStack.Screen
      name="Podcasts"
      component={PodcastsScreen}
      options={{
        ...getCommonNavigationOptions(),
      }}
    />
    <PodcastsStack.Screen
      name="Podcast"
      component={PodcastScreen}
      options={
        ({ route }) => ({
          headerLeft: () => <BackButton />,
          headerRight: () => <FeedButton collection={route.params.podcast} />,
          title: route.params.podcast.title,
        })
      }
    />
    <PodcastsStack.Screen
      name="SinglePodcastEpisode"
      component={SinglePodcastEpisodeScreen}
      options={{
        headerLeft: () => <BackButton />,
        title: 'Podcasts',
      }}
    />
    <PodcastsStack.Screen
      name="Contributor"
      component={ContributorScreen}
      options={getContributorScreenOptions}
    />
    <PodcastsStack.Screen
      name="SearchResults"
      component={SearchResultsScreen}
      options={getSearchResultsScreenOptions}
    />
  </PodcastsStack.Navigator>
);

const MeditationsStack = createStackNavigator();
const MeditationsNavigator = () => (
  <MeditationsStack.Navigator screenOptions={{ headerTitleAlign: 'center' }}>
    <MeditationsStack.Screen
      name="Meditations"
      component={MeditationsScreen}
      options={{
        ...getCommonNavigationOptions(),
      }}
    />
    <MeditationsStack.Screen
      name="MeditationsCategory"
      component={MeditationsCategoryScreen}
      options={
        ({ route }) => ({
          headerLeft: () => <BackButton />,
          headerRight: () => <FeedButton collection={route.params.category} />,
          title: route.params.category.title,
        })
      }
    />
    <MeditationsStack.Screen
      name="SingleMeditation"
      component={SingleMeditationScreen}
      options={{
        headerLeft: () => <BackButton />,
        title: 'Meditations',
      }}
    />
    <MeditationsStack.Screen
      name="Contributor"
      component={ContributorScreen}
      options={getContributorScreenOptions}
    />
    <MeditationsStack.Screen
      name="SearchResults"
      component={SearchResultsScreen}
      options={getSearchResultsScreenOptions}
    />
  </MeditationsStack.Navigator>
);

const LiturgiesStack = createStackNavigator();
const LiturgiesNavigator = () => (
  <LiturgiesStack.Navigator screenOptions={{ headerTitleAlign: 'center' }}>
    <LiturgiesStack.Screen name="Liturgies" component={LiturgiesScreen} />
    <LiturgiesStack.Screen
      name="Liturgy"
      component={LiturgyScreen}
      options={getLiturgyScreenOptions}
    />
    <LiturgiesStack.Screen
      name="SingleLiturgyItem"
      component={SingleLiturgyItemScreen}
      options={{
        headerLeft: () => <BackButton />,
        title: 'Liturgies',
      }}
    />
    <LiturgiesStack.Screen
      name="Contributor"
      component={ContributorScreen}
      options={getContributorScreenOptions}
    />
    <LiturgiesStack.Screen
      name="SearchResults"
      component={SearchResultsScreen}
      options={getSearchResultsScreenOptions}
    />
  </LiturgiesStack.Navigator>
);

const TabBar = props => (
  <View>
    <PlayerStrip navigation={props.navigation} />
    <BottomTabBar {...props} />
  </View>
);

const Tabs = createBottomTabNavigator();
const TabsNavigator = () => (
  <Tabs.Navigator
    screenOptions={{
      tabBarComponent: TabBar,
    }}
    tabBarOptions={{
      activeTintColor: colors.background,
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
    }}
  >
    <Tabs.Screen
      name="Home"
      component={HomeNavigator}
      options={{
        headerTitleAlign: 'center',
        tabBarIcon: HomeIcon,
        tabBarLabel: 'Home',
      }}
    />
    <Tabs.Screen
      name="Podcasts"
      component={PodcastsNavigator}
      options={{
        ...getCommonNavigationOptions(),
        tabBarIcon: PodcastsIcon,
      }}
    />
    <Tabs.Screen
      name="Meditations"
      component={MeditationsNavigator}
      options={{
        ...getCommonNavigationOptions(),
        tabBarIcon: MeditationsIcon,
        title: 'Meditations',
      }}
    />
    <Tabs.Screen
      name="Liturgies"
      component={LiturgiesNavigator}
      options={{
        ...getCommonNavigationOptions(),
        tabBarIcon: LiturgiesIcon,
      }}
    />
  </Tabs.Navigator>
);

const PatreonStack = createStackNavigator();
const PatreonNavigator = () => (
  <PatreonStack.Navigator mode="modal">
    <PatreonStack.Screen
      name="PatreonInfo"
      component={PatreonScreen}
      options={{
        headerTitle: '',
        headerTransparent: true,
        headerLeft: () => <CloseButton />,
      }}
    />
    <PatreonStack.Screen name="PatreonAuth" component={PatreonAuthScreen} />
  </PatreonStack.Navigator>
);

const playerStyles = {
  closeIcon: {
    fontSize: 24,
    paddingHorizontal: 10,
  },
};

// hack to get the header to appear (it doesn't with a TabNavigator)
const PlayerStack = createStackNavigator();
const PlayerWithHeader = () => (
  <PlayerStack.Navigator>
    <PlayerStack.Screen
      name="Player"
      component={PlayerScreen}
      options={
        ({ navigation }) => ({
          headerLeft: () => (
            <FontAwesome
              name="angle-down"
              style={playerStyles.closeIcon}
              onPress={() => navigation.goBack()}
            />
          ),
          title: '',
        })
      }
    />
  </PlayerStack.Navigator>
);

const CommunityStack = createStackNavigator();
const CommunityNavigator = () => (
  <CommunityStack.Navigator>
    <CommunityStack.Screen
      name="Community"
      component={CommunityScreen}
      options={{
        headerLeft: () => <CloseButton />,
        title: 'Community',
      }}
    />
    <CommunityStack.Screen
      name="Hangout"
      component={HangoutScreen}
      options={{
        headerLeft: () => <BackButton />,
        headerTitle: 'Hangout Rooms',
      }}
    />
  </CommunityStack.Navigator>
);

const ModalsStack = createStackNavigator();
const ModalsNavigator = () => (
  <ModalsStack.Navigator mode="modal" headerMode="none">
    <ModalsStack.Screen name="Main" component={TabsNavigator} />
    <ModalsStack.Screen name="Patreon" component={PatreonNavigator} />
    <ModalsStack.Screen name="Player" component={PlayerWithHeader} />
    <ModalsStack.Screen name="Community" component={CommunityNavigator} />
  </ModalsStack.Navigator>
);

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
});

const MainScreen = () => (
  <View style={styles.container}>
    <ModalsNavigator />
    <DropdownAlert
      ref={(ref) => { setDropdown(ref); }}
      messageNumOfLines={10}
      closeInterval={null}
      showCancel
    />
  </View>
);

const Drawer = createDrawerNavigator();
const MainNavigator = () => {
  const dimensions = useWindowDimensions();

  return (
    <Drawer.Navigator
      drawerContent={
        props => <DrawerContent {...props} />
      }
      screenOptions={{
        drawerStyle: {
          width: dimensions.width * 0.75,
        },
      }}
      {
      ...Platform.select({
        ios: {
          drawerType: 'back',
          overlayColor: '#00000000',
        },
        android: {},
      })
      }
    >
      <Drawer.Screen name="Main" component={MainScreen} />
    </Drawer.Navigator>
  );
};

MainNavigator.propTypes = {
  apiError: PropTypes.shape({}),
};

MainNavigator.defaultProps = {
  apiError: null,
};

export default MainNavigator;
