import 'react-native-gesture-handler';

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import * as Sentry from 'sentry-expo';
import * as SplashScreen from 'expo-splash-screen';
import { Provider, connect } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { NavigationContainer } from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';

import MainNavigator from './navigation/MainNavigator';
import { navigate, setTopLevelNavigator } from './navigation/NavigationService';
import * as navActions from './navigation/actions';
import configureStore from './state/store';
import Reactotron from '../reactotron-config';

import WelcomeScreen from './screens/WelcomeScreen';
import { shouldShowWelcome } from './state/ducks/welcome/selectors';

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  // this is only defined because firebase yells if it's missing.
  // eslint-disable-next-line no-console
  console.log('Background message: ', remoteMessage);
});

class Deferred {
  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
}

// eslint-disable-next-line
console.tron = Reactotron;


const sentryPublicDSN = 'https://798a3f14b3df4af39a83fbb770197e10@o233194.ingest.sentry.io/1395784';
Sentry.init({
  dsn: sentryPublicDSN,
});

const navigationDeferred = new Deferred();

function getItem(notification) {
  const { data } = notification;
  const { contentType, entryId } = data;
  if (contentType && entryId) {
    return { type: contentType, id: entryId };
  }
  return null;
}

function navigateFromNotification(notification) {
  const item = getItem(notification);
  if (item) {
    const action = navActions.openItem(item);
    navigate(action.routeName, action.params);
  }
}

class App extends React.Component {
  componentDidMount() {
    messaging().getInitialNotification()
      .then((notificationOpen) => {
        if (notificationOpen) {
          // App was opened by a notification
          const { notification } = notificationOpen;
          navigationDeferred.promise.then(() => {
            navigateFromNotification(notification);
          });
        }
      });

    this.removeListenerCallbacks = [
      messaging().onNotificationOpenedApp(({ notification }) => {
        navigateFromNotification(notification);
      }),
    ];
  }

  componentWillUnmount() {
    this.removeListenerCallbacks.forEach(removeListener => removeListener());
  }

  render() {
    if (this.props.showWelcome) {
      return <WelcomeScreen />;
    }

    return (
      <NavigationContainer
        ref={(navigator) => {
          setTopLevelNavigator(navigator);
          navigationDeferred.resolve(navigator);
        }}
      >
        <MainNavigator />
      </NavigationContainer>
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

const AppLoading = () => {
  useEffect(() => {
    SplashScreen.preventAutoHideAsync().catch(() => {});
    return () => {
      SplashScreen.hideAsync().catch(() => {});
    };
  });
  return null;
};

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
