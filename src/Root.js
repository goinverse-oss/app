import React from 'react';
import PropTypes from 'prop-types';
import Sentry from 'sentry-expo';
import { Provider, connect } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { createAppContainer } from 'react-navigation';
import { AppLoading } from 'expo';
// import { useScreens } from 'react-native-screens';

import MainNavigator from './navigation/MainNavigator';
import { setTopLevelNavigator } from './navigation/NavigationService';
import configureStore from './state/store';
import Reactotron from '../reactotron-config';

import config from '../config.json';
import WelcomeScreen from './screens/WelcomeScreen';
import { shouldShowWelcome } from './state/ducks/welcome/selectors';

// eslint-disable-next-line
console.tron = Reactotron;


if (config.sentryPublicDSN) {
  Sentry.config(config.sentryPublicDSN).install();
}

// disable react-native-screens until this critical issue is resolved:
// https://github.com/kmagiera/react-native-screens/issues/61
// useScreens();

const AppContainer = createAppContainer(MainNavigator);

class App extends React.Component {
  render() {
    if (this.props.showWelcome) {
      return <WelcomeScreen />;
    }

    return (
      <AppContainer
        ref={navigator => setTopLevelNavigator(navigator)}
      />
    );
  }
}

App.propTypes = {
  showWelcome: PropTypes.bool.isRequired,
};

function mapStateToProps(state) {
  return {
    showWelcome: shouldShowWelcome(state),
  };
}

const ReduxApp = connect(mapStateToProps)(App);

const { store, persistor } = configureStore();

/**
 * App entry point. Wraps everything else so that
 * child components have access to the navigation
 * functions and the redux store.
 */
const Root = () => (
  <Provider store={store}>
    <PersistGate loading={<AppLoading />} persistor={persistor}>
      <ReduxApp />
    </PersistGate>
  </Provider>
);

export default Root;
