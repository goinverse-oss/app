import { ActionsObservable } from 'redux-observable';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import configureStore from '../../store';
import * as types from './types';
import * as actions from './actions';
import * as selectors from './selectors';
import { getModelName } from './utils';
import epic from './epic';
import config from '../../../../config.json';

// TODO: generate test data from fakeapi factories?
// TODO: or maybe swagger?
const cases = [
  {
    description: 'stores a meditation',
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
    relationships: {
      category: undefined,
      contributors: [],
      tags: [],
    },
  },

  {
    description: 'stores a meditation category',
    apiJson: {
      data: [
        {
          id: '123',
          type: 'meditationCategories',
          attributes: {
            title: 'Category 123',
            description: 'Mindfulness.',
          },
        },
      ],
    },
    relationships: {
      tags: [],
    },
  },

  {
    description: 'stores a contributor',
    apiJson: {
      data: [
        {
          id: '123',
          type: 'contributors',
          attributes: {
            name: 'Mike McHargue',
            url: 'http://mikemchargue.com',
            twitter: '@mikemchargue',
          },
        },
      ],
    },
    relationships: {},
  },

  {
    description: 'stores a tag',
    apiJson: {
      data: [
        {
          id: '123',
          type: 'tags',
          attributes: {
            name: 'Lent',
          },
        },
      ],
    },
    relationships: {},
  },
];

describe('orm reducer', () => {
  let store;

  beforeEach(() => {
    store = configureStore({ noEpic: true });
  });

  cases.forEach(({ description, apiJson, relationships }) => {
    describe(description, () => {
      let type;
      let apiData;
      let expected;

      beforeEach(() => {
        store.dispatch(actions.receiveData(apiJson));

        [apiData] = apiJson.data;
        ({ type } = apiData);

        expected = {
          id: apiData.id,
          ...apiData.attributes,
          ...relationships,
        };
      });

      it('collection', () => {
        const collectionSelector = selectors[`${type}Selector`];
        const collection = collectionSelector(store.getState());
        expect(collection[0]).toEqual(expected);
      });

      it('instance', () => {
        const instanceType = getModelName(type).replace(/^\w/, c => c.toLowerCase());
        const instanceSelector = selectors[`${instanceType}Selector`];
        const instance = instanceSelector(store.getState(), apiData.id);
        expect(instance).toEqual(expected);
      });
    });
  });

  it('stores an API error', () => {
    const expectedError = new Error('404 OOPS LOL');
    store.dispatch(actions.receiveApiError(expectedError));

    const error = selectors.apiErrorSelector(store.getState());
    expect(error).toEqual(expectedError);
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
  const baseUrl = config.apiBaseUrl;
  let mock;

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  // These tests are very simple; one action leads to a single other.
  // Other tests that result in multiple actions from the epic
  // will have to be a little more complicated.

  describe('when API call succeeds', () => {
    let payload;

    beforeEach(() => {
      payload = {
        data: {
          attributes: {
            foo: 'bar',
          },
        },
      };
      mock.onGet(new RegExp(`${baseUrl}/.*`)).reply(200, payload);
    });

    test('fetchData() leads to receiveData()', async () => {
      const args = { resource: 'foo' };
      const url = `${baseUrl}/${args.resource}`;

      const action$ = ActionsObservable.of(actions.fetchData(args));
      const responseAction = await epic(action$).toPromise();

      // assert that the request was made
      expect(mock.history.get[0].url).toEqual(url);

      expect(responseAction).toEqual(actions.receiveData(payload));
    });
  });

  describe('when API call fails', () => {
    const status = 429;

    beforeEach(() => {
      mock.onGet(new RegExp(`${baseUrl}/.*`)).reply(status, {});
    });

    function expectErrorActionWithStatus(action, statusCode) {
      expect(action.type).toEqual(types.RECEIVE_API_ERROR);
      expect(action.error).toBe(true);
      expect(action.payload).toBeInstanceOf(Error);
      expect(action.payload.response.status).toEqual(statusCode);
    }

    test('fetchData() leads to receiveApiError()', async () => {
      const args = { resource: 'foo' };
      const url = `${baseUrl}/${args.resource}`;

      const action$ = ActionsObservable.of(actions.fetchData(args));
      const errorAction = await epic(action$).toPromise();

      // assert that the request was made
      expect(mock.history.get[0].url).toEqual(url);

      expectErrorActionWithStatus(errorAction, status);
    });
  });
});
