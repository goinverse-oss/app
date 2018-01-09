import { combineReducers, createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { combineEpics, createEpicMiddleware } from 'redux-observable';

import * as reducers from './ducks';
import epics from './epics';

export default function configureStore() {
  const reducer = combineReducers(reducers);
  const epic = combineEpics(...epics);
  const epicMiddleware = createEpicMiddleware(epic);
  const enhancer = composeWithDevTools(applyMiddleware(epicMiddleware));
  return createStore(reducer, enhancer);
}
