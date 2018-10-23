import { ActionsObservable } from 'redux-observable';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import configureStore from '../../store';
import * as types from './types';
import * as actions from './actions';
import * as selectors from './selectors';
import epic from './epic';

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

  test('patreonEnabled() enables patreon', () => {
    store.dispatch(actions.patreonEnabled());
    expect(selectors.isPatron(store.getState())).toBe(true);
  });

  test('patreonDisabled() disables patreon', () => {
    store.dispatch(actions.patreonEnabled());
    expect(selectors.isPatron(store.getState())).toBe(true);

    store.dispatch(actions.patreonDisabled());
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
  const baseUrl = 'https://httpbin.org';
  let mock;

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  // These tests are very simple; one action leads to a single other.
  // Other tests that result in multiple actions from the epic
  // will have to be a little more complicated.

  describe('when Patreon API call succeeds', () => {
    beforeEach(() => {
      mock.onPost(new RegExp(`${baseUrl}/.*`)).reply(200, {});
    });

    test('enable() leads to patreonEnabled()', () => {
      const action$ = ActionsObservable.of(actions.enable());
      return expect(epic(action$).toPromise()).resolves.toEqual(actions.patreonEnabled());
    });

    test('disable() leads to patreonDisabled()', () => {
      const action$ = ActionsObservable.of(actions.disable());
      return expect(epic(action$).toPromise()).resolves.toEqual(actions.patreonDisabled());
    });
  });

  describe('when Patreon API call fails', () => {
    const status = 429;

    beforeEach(() => {
      mock.onPost(new RegExp(`${baseUrl}/.*`)).reply(status, {});
    });

    function expectErrorActionWithStatus(action, statusCode) {
      expect(action.type).toEqual(types.PATREON_ERROR);
      expect(action.error).toBe(true);
      expect(action.payload).toBeInstanceOf(Error);
      expect(action.payload.response.status).toEqual(statusCode);
    }

    test('enable() leads to patreonError()', async () => {
      const action$ = ActionsObservable.of(actions.enable());
      const errorAction = await epic(action$).toPromise();
      expectErrorActionWithStatus(errorAction, status);
    });

    test('disable() leads to patreonError()', async () => {
      const action$ = ActionsObservable.of(actions.disable());
      const errorAction = await epic(action$).toPromise();
      expectErrorActionWithStatus(errorAction, status);
    });
  });
});
