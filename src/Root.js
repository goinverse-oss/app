import React from 'react';
import PropTypes from 'prop-types';
import Sentry from 'sentry-expo';
import { Platform } from 'react-native';
import { Provider, connect } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { createAppContainer } from 'react-navigation';
import { AppLoading } from 'expo';
import firebase from 'react-native-firebase';
// import { useScreens } from 'react-native-screens';

import MainNavigator from './navigation/MainNavigator';
import { navigate, setTopLevelNavigator } from './navigation/NavigationService';
import * as navActions from './navigation/actions';
import configureStore from './state/store';
import Reactotron from '../reactotron-config';

import config from '../config.json';
import WelcomeScreen from './screens/WelcomeScreen';
import { shouldShowWelcome } from './state/ducks/welcome/selectors';

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


if (config.sentryPublicDSN) {
  Sentry.config(config.sentryPublicDSN).install();
}

// disable react-native-screens until this critical issue is resolved:
// https://github.com/kmagiera/react-native-screens/issues/61
// useScreens();

const AppContainer = createAppContainer(MainNavigator);
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
  console.log('Opened with notification: ', notification);
  const item = getItem(notification);
  if (item) {
    const action = navActions.openItem(item);
    navigate(action.routeName, action.params);
  }
}

class App extends React.Component {
  componentDidMount() {
    firebase.notifications().getInitialNotification()
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
      firebase.notifications().onNotificationDisplayed((notification) => {
        navigateFromNotification(notification);
      }),
      firebase.notifications().onNotificationOpened(({ notification }) => {
        navigateFromNotification(notification);
      }),
    ];

    if (Platform.OS === 'ios') {
      // Clear any badge set by a not-yet-opened notification
      const notification = new firebase.notifications.Notification();
      notification.ios.setBadge(0);
      firebase.notifications().displayNotification(notification);
    }

    if (Platform.OS === 'android') {
      const channel = new firebase.notifications.Android.Channel(
        'main',
        'Main',
        firebase.notifications.Android.Importance.Max,
      ).setDescription('The Liturgists App Notifications');

      // Create the channel
      firebase.notifications().android.createChannel(channel);
    }
  }

  componentWillUnmount() {
    this.removeListenerCallbacks.forEach(removeListener => removeListener());
  }

  render() {
    if (this.props.showWelcome) {
      return <WelcomeScreen />;
    }

    return (
      <AppContainer
        ref={(navigator) => {
          setTopLevelNavigator(navigator);
          navigationDeferred.resolve(navigator);
        }}
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
