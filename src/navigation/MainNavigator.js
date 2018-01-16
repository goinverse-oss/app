import React from 'react';
import { StackNavigator, TabNavigator, DrawerNavigator } from 'react-navigation';

import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import PatreonScreen from '../screens/PatreonScreen';
import PodcastsScreen from '../screens/PodcastsScreen';
import MeditationsScreen from '../screens/MeditationsScreen';

const Navigator = () => {
  const Tabs = TabNavigator({
    Home: { screen: HomeScreen },
    Podcasts: { screen: PodcastsScreen },
    Meditations: { screen: MeditationsScreen },
  }, {
    navigationOptions: {
      drawerLabel: 'Home',
    },
  });

  // hack to get the header to appear (it doesn't with a TabNavigator)
  const MainWithHeader = StackNavigator({
    MainWithHeader: { screen: Tabs },
  });

  const PatreonWithHeader = StackNavigator({
    PatreonWithHeader: { screen: PatreonScreen },
  });

  const Drawer = DrawerNavigator({
    Main: { screen: MainWithHeader },
    Patreon: { screen: PatreonWithHeader },
    Logout: { screen: LoginScreen },
  });

  return <Drawer />;
};

export default Navigator;
