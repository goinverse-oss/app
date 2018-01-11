import React from 'react';
import { Provider } from 'react-redux';

import AppNavigator from './navigation/AppNavigator';
import configureStore from './state/store';

/**
 * App entry point. Wraps everything else so that
 * child components have access to the navigation
 * functions and the redux store.
 */
const Root = () => (
  <Provider store={configureStore()}>
    <AppNavigator />
  </Provider>
);

export default Root;
