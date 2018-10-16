import { createSwitchNavigator } from 'react-navigation';

import LoginScreen from '../screens/LoginScreen';
import MainNavigator from './MainNavigator';

const AppNavigator = createSwitchNavigator({
  Login: { screen: LoginScreen },
  Main: { screen: MainNavigator },
});

export default AppNavigator;
