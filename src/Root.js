import React from 'react';
import { Provider } from 'react-redux';
import { createAppContainer } from 'react-navigation';
import { useScreens } from 'react-native-screens';

import AppNavigator from './navigation/AppNavigator';
import { setTopLevelNavigator } from './navigation/NavigationService';
import configureStore from './state/store';

useScreens();

const AppContainer = createAppContainer(AppNavigator);

class App extends React.Component {
  render() {
    return (
      <AppContainer
        ref={navigator => setTopLevelNavigator(navigator)}
      />
    );
  }
}

/**
 * App entry point. Wraps everything else so that
 * child components have access to the navigation
 * functions and the redux store.
 */
const Root = () => (
  <Provider store={configureStore()}>
    <App />
  </Provider>
);

export default Root;
