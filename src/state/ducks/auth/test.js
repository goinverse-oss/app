import configureStore from '../../store';
import * as actions from './actions';
import * as selectors from './selectors';

let store;

beforeEach(() => {
  ({ store } = configureStore({ noEpic: true }));
});

test('user is initially not logged in', () => {
  expect(selectors.isAuthenticated(store.getState())).toBe(false);
});

test('login() logs the user in', () => {
  store.dispatch(actions.login());
  expect(selectors.isAuthenticated(store.getState())).toBe(true);
});

test('logout() logs the user out', () => {
  store.dispatch(actions.login());
  expect(selectors.isAuthenticated(store.getState())).toBe(true);

  store.dispatch(actions.logout());
  expect(selectors.isAuthenticated(store.getState())).toBe(false);
});
