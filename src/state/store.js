import { combineReducers, createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { combineEpics, createEpicMiddleware } from 'redux-observable';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/never';

import * as reducers from './ducks';
import epics from './epics';

/**
 * A fake epic that just swallows actions. Useful for synchronous unit tests.
 */
const emptyEpic = () => Observable.never();

/**
 * Return a redux store configured with all the reducers and middleware.
 *
 * If noEpic is passed, use emptyEpic to swallow all async actions.
 * This allows testing the store with just synchronous actions,
 * not worrying about side effects.
 */
export default function configureStore({ noEpic = false } = {}) {
  const reducer = combineReducers(reducers);
  const epic = noEpic ? emptyEpic : combineEpics(...epics);
  const epicMiddleware = createEpicMiddleware(epic);
  const enhancer = composeWithDevTools(applyMiddleware(epicMiddleware));
  return createStore(reducer, enhancer);
}
