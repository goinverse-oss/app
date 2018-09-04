import { ActionsObservable } from 'redux-observable';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import configureStore from '../../store';
import * as types from './types';
import * as actions from './actions';
import * as selectors from './selectors';
import epic from './epic';

let store;

beforeEach(() => {
  store = configureStore({ noEpic: true });
});

const cases = [
  {
    description: 'stores a simple response',
    apiJson: {
      data: [
        {
          id: '123',
          type: 'meditations',
          attributes: {
            title: 'Meditation 123',
            description: 'Good vibes.',
          },
        },
      ],
    },
    meditation: {
      category: undefined,
      contributors: [],
      tags: [],
    },
  },
];

describe('orm reducer', () => {
  cases.forEach(({ description, apiJson, meditation }) => {
    it(description, () => {
      store.dispatch(actions.receiveData(apiJson));

      const obj = selectors.meditationsSelector(store.getState());
      const meditationData = apiJson.data[0];
      expect(obj[0]).toEqual({
        id: meditationData.id,
        ...meditationData.attributes,
        ...meditation,
      });
    });
  });
});

/*
 * Direct epic tests are very simple. An epic is just a function
 * that accepts an ActionsObservable and returns an Observable.
 * A test for an epic therefore just has to:
 * 1) Create an ActionObservable that emits the action(s) you want to test
 * 2) Assert that the Observable the epic returns emits the expected action(s)
 */

describe('api epic', () => {
  const baseUrl = 'https://httpbin.org';
  let mock;

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  // These tests are very simple; one action leads to a single other.
  // Other tests that result in multiple actions from the epic
  // will have to be a little more complicated.

  describe('when API call succeeds', () => {
    beforeEach(() => {
      mock.onPost(new RegExp(`${baseUrl}/.*`)).reply(200, {});
    });

    test('fetchData() leads to receiveData()', () => {
      const action$ = ActionsObservable.of(actions.fetchData());
      return expect(
        epic(action$).toPromise(),
      ).resolves.toEqual(
        actions.receiveData(),
      );
    });
  });

  describe('when API call fails', () => {
    const status = 429;

    beforeEach(() => {
      mock.onPost(new RegExp(`${baseUrl}/.*`)).reply(status, {});
    });

    function expectErrorActionWithStatus(action, statusCode) {
      expect(action.type).toEqual(types.RECEIVE_API_ERROR);
      expect(action.error).toBe(true);
      expect(action.payload).toBeInstanceOf(Error);
      expect(action.payload.response.status).toEqual(statusCode);
    }

    test('fetchData() leads to receiveApiError()', async () => {
      const action$ = ActionsObservable.of(actions.fetchData());
      const errorAction = await epic(action$).toPromise();
      expectErrorActionWithStatus(errorAction, status);
    });
  });
});
