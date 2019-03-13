import { ActionsObservable } from 'redux-observable';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import configureStore from '../../store';
// import * as types from './types';
import * as actions from './actions';
import * as selectors from './selectors';
import epic from './epic';

import config from '../../../../config.json';

const mock = new MockAdapter(axios);

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
  const token = { access_token: 'foo', refresh_token: 'bar' };

  beforeEach(() => {
    ({ store } = configureStore({ noEpic: true }));
  });

  test('patreon is initially not enabled', () => {
    expect(selectors.isConnected(store.getState())).toBe(false);
  });

  test('storeToken() enables patreon', () => {
    store.dispatch(actions.storeToken(token));
    expect(selectors.isConnected(store.getState())).toBe(true);
  });

  test('disconnect() disables patreon', () => {
    store.dispatch(actions.storeToken(token));
    expect(selectors.isConnected(store.getState())).toBe(true);

    store.dispatch(actions.disconnect());
    expect(selectors.isConnected(store.getState())).toBe(false);
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

  describe('refreshAccessToken()', () => {
    const retryAction = { type: 'FOO' };
    const errorAction = { type: 'BAR' };
    const action = actions.refreshAccessToken({
      retryAction,
      errorAction,
    });
    let action$;
    let store;

    let patreonMock;

    beforeEach(() => {
      ({ store } = configureStore({ noEpic: true }));
      action$ = ActionsObservable.of(action);
      patreonMock = mock.onPost(`${config.apiBaseUrl}/patreon/validate`);
    });

    afterEach(() => {
      mock.reset();
    });

    test('leads to retry action if refresh succeeds', async () => {
      const patreonAuth = {
        access_token: 'foo',
        refresh_token: 'bar',
      };
      const newPatreonAuth = {
        access_token: 'baz',
        refresh_token: 'quux',
      };
      store.dispatch(actions.storeToken(patreonAuth));
      patreonMock.reply(200, newPatreonAuth);

      const resultAction = await epic(action$, store).toPromise();
      expect(resultAction).toEqual(retryAction);
    });

    test('leads to error action if refresh fails', async () => {
      const patreonAuth = {
        access_token: 'foo',
        refresh_token: 'bar',
      };
      store.dispatch(actions.storeToken(patreonAuth));
      patreonMock.reply(401, {});

      const resultAction = await epic(action$, store).toPromise();
      expect(resultAction).toEqual(errorAction);
    });

    test("leads to error action if there's no refresh token", async () => {
      const resultAction = await epic(action$, store).toPromise();
      expect(resultAction).toEqual(errorAction);
    });
  });
});
