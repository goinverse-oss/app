// Bootstrapped from the example app at https://reactnavigation.org/docs/guides/redux

import { RawNavigator } from '../../../navigation/AppNavigator';

const initialAction = RawNavigator.router.getActionForPathAndParams('Login');
const initialState = RawNavigator.router.getStateForAction(initialAction);

// state shape is defined by react-navigation

export default function reducer(state = initialState, action) {
  const nextState = RawNavigator.router.getStateForAction(action, state);
  return nextState || state;
}
