import { combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import * as reducers from './ducks';

export default function configureStore() {
  const reducer = combineReducers(reducers);
  return createStore(
    reducer,
    composeWithDevTools(),
  );
}
