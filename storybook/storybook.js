/* eslint-disable global-require */
import React, { Component } from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { createSwitchNavigator } from 'react-navigation';
import { getStorybookUI, configure } from '@storybook/react-native';

import { loadStories } from './storyLoader';

// import stories
configure(loadStories, module);

// set up fake redux state
const stubReducer = () => {};

const StorybookScreen = () => (
  <Provider store={createStore(stubReducer)}>
    <StorybookUIRoot />
  </Provider>
);

const StorybookNavigator = createSwitchNavigator({
  Storybook: { screen: StorybookScreen },
});

// This assumes that storybook is running on the same host as your RN packager,
// to set manually use, e.g. host: 'localhost' option
const StorybookUIRoot = getStorybookUI({ port: 7007, onDeviceUI: true });

// react-native hot module loader must take in a Class - https://github.com/facebook/react-native/issues/10991
// https://github.com/storybooks/storybook/issues/2081
// eslint-disable-next-line react/prefer-stateless-function
class StorybookUIHMRRoot extends Component {
  render() {
    return (
      <StorybookNavigator />
    );
  }
}

// AppRegistry.registerComponent('app', () => StorybookUIHMRRoot);
export default StorybookUIHMRRoot;
