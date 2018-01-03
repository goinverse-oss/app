import { combineReducers, createStore } from 'redux';

import * as reducers from './ducks';

export default function configureStore() {
  const reducer = combineReducers(reducers);
  return createStore(reducer);
}
