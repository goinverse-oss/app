import _ from 'lodash';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import { combineEpics, createEpicMiddleware } from 'redux-observable';
import { persistReducer, persistStore, createMigrate } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // AsyncStorage for react-native

import { Observable } from 'rxjs';
import 'rxjs/add/observable/never';

import Reactotron from '../../reactotron-config';

import reducer from './reducer';
import epics from './epics';

const migrations = {
  0: state => ({
    ...state,
    auth: {
      patreonToken: null,
    },
    patreon: _.omit(state.patreon, 'token'),
  }),
};

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['auth', 'playback'],
  version: 0,
  migrate: createMigrate(migrations),
};
const persistedReducer = persistReducer(persistConfig, reducer);

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
  const epic = noEpic ? emptyEpic : combineEpics(...epics);
  const epicMiddleware = createEpicMiddleware(epic);
  const enhancer = applyMiddleware(epicMiddleware);

  const store = createStore(
    persistedReducer,
    composeWithDevTools(
      enhancer,
      Reactotron.createEnhancer(),
    ),
  );

  // https://facebook.github.io/react-native/blog/2016/03/24/introducing-hot-reloading.html
  if (module.hot) {
    module.hot.accept(() => {
      // eslint-disable-next-line global-require
      const nextRootReducer = require('./reducer').default;
      store.replaceReducer(
        persistReducer(persistConfig, nextRootReducer),
      );
    });
  }
  const persistor = persistStore(store);

  return { store, persistor };
}
