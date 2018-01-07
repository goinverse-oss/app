import React from 'react';
import { Provider } from 'react-redux';

import AppNavigator from './navigators/AppNavigator';
import configureStore from './state/store';

const Root = () => (
  <Provider store={configureStore()}>
    <AppNavigator />
  </Provider>
);

export default Root;
