import { TabNavigator } from 'react-navigation';

import HomeScreen from '../screens/HomeScreen';
import PodcastsScreen from '../screens/PodcastsScreen';

export default TabNavigator({
  Home: { screen: HomeScreen },
  Podcasts: { screen: PodcastsScreen },
});
