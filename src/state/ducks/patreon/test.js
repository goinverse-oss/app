// import { ActionsObservable } from 'redux-observable';
// import axios from 'axios';
// import MockAdapter from 'axios-mock-adapter';

import configureStore from '../../store';
// import * as types from './types';
import * as actions from './actions';
import * as selectors from './selectors';
// import epic from './epic';

/*
 * Reducers are tested by stubbing out the epic with one that does nothing,
 * and then asserting things about the synchronous actions only. Later,
 * we test that the epics emit those synchronous actions in response
 * to the async stuff they do, which closes the loop and effectively
 * tests that dispatching the async action that the epic handled
 * eventually caused the expected state change.
 *
 * This is a lot simpler than trying to test the entire store
 * with the redux-observable middleware installed, and it gives us
 * the same coverage.
 */

describe('patreon reducer', () => {
  let store;

  beforeEach(() => {
    store = configureStore({ noEpic: true });
  });

  test('patreon is initially not enabled', () => {
    expect(selectors.isPatron(store.getState())).toBe(false);
  });

  test('storeToken() enables patreon', () => {
    store.dispatch(actions.storeToken());
    expect(selectors.isPatron(store.getState())).toBe(true);
  });

  test('disconnect() disables patreon', () => {
    store.dispatch(actions.storeToken());
    expect(selectors.isPatron(store.getState())).toBe(true);

    store.dispatch(actions.disconnect());
    expect(selectors.isPatron(store.getState())).toBe(false);
  });
});


/*
 * Direct epic tests are very simple. An epic is just a function
 * that accepts an ActionsObservable and returns an Observable.
 * A test for an epic therefore just has to:
 * 1) Create an ActionObservable that emits the action(s) you want to test
 * 2) Assert that the Observable the epic returns emits the expected action(s)
 */

describe('patreon epic', () => {
  // TODO: mock patreon auth and test epic
});
