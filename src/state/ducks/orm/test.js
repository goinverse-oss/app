import _ from 'lodash';
import { ActionsObservable } from 'redux-observable';
import contentful from 'contentful/dist/contentful.browser';
import moment from 'moment';
import pluralize from 'pluralize';

import configureStore from '../../store';
import * as types from './types';
import * as actions from './actions';
import * as selectors from './selectors';
import { getModelName, getRelationships } from './utils';
import epic from './epic';

jest.mock('contentful/dist/contentful.browser');

function contentType(type) {
  return {
    contentType: {
      sys: {
        id: type,
      },
    },
  };
}

function timestamps() {
  return {
    createdAt: moment(),
    updatedAt: moment(),
  };
}

function getExpectedTimestamps(item) {
  return _.pick(item.sys, ['createdAt', 'updatedAt']);
}

function getExpectedRelationships(item) {
  const relationships = getRelationships(item);

  function convertOne(value) {
    return {
      id: value.sys.id,
      ...value.fields,
      ...getExpectedTimestamps(value),
    };
  }

  const expected = _.mapValues(relationships, (value) => {
    if (_.isArray(value)) {
      return value.map(convertOne);
    }
    return convertOne(value);
  });
  return expected;
}

// TODO: generate test data from fakeapi factories?
// TODO: or maybe swagger?
const cases = [
  {
    description: 'stores a meditation',
    apiJson: {
      items: [
        {
          sys: {
            id: '123',
            ...contentType('meditation'),
            ...timestamps(),
          },
          fields: {
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
      items: [
        {
          sys: {
            id: '123',
            ...contentType('meditationCategory'),
            ...timestamps(),
          },
          fields: {
            title: 'Category 123',
            description: 'Mindfulness.',
          },
        },
      ],
    },
    relationships: {
      tags: [],
      meditations: [],
    },
  },

  {
    description: 'stores a podcast episode',
    apiJson: {
      items: [
        {
          sys: {
            id: '123',
            ...contentType('podcastEpisode'),
            ...timestamps(),
          },
          fields: {
            title: 'Episode 123',
            description: 'Words and stuff.',
          },
        },
      ],
    },
    relationships: {
      podcast: undefined,
      season: undefined,
      contributors: [],
      tags: [],
    },
  },

  {
    description: 'stores a podcast',
    apiJson: {
      items: [
        {
          sys: {
            id: '123',
            ...contentType('podcast'),
            ...timestamps(),
          },
          fields: {
            title: 'The Liturgists Podcast',
            description: 'There is room at the table for all who are hungry.',
          },
        },
      ],
    },
    relationships: {
      seasons: [],
      episodes: [],
      contributors: [],
      tags: [],
    },
  },

  {
    description: 'stores a podcast season',
    apiJson: {
      items: [
        {
          sys: {
            id: '123',
            ...contentType('podcastSeason'),
            ...timestamps(),
          },
          fields: {
            title: 'Season 4',
            description: 'New hosts!',
          },
        },
      ],
    },
    relationships: {
      podcast: undefined,
      episodes: [],
      contributors: [],
      tags: [],
    },
  },

  {
    description: 'stores a contributor',
    apiJson: {
      items: [
        {
          sys: {
            id: '123',
            ...contentType('contributor'),
            ...timestamps(),
          },
          fields: {
            name: 'Mike McHargue',
            url: 'http://mikemchargue.com',
            twitter: '@mikemchargue',
          },
        },
      ],
    },
  },

  {
    description: 'stores a tag',
    apiJson: {
      items: [
        {
          sys: {
            id: '123',
            ...contentType('tag'),
            ...timestamps(),
          },
          fields: {
            name: 'Lent',
          },
        },
      ],
    },
  },

  {
    description: 'stores instance api response',
    apiJson: {
      sys: {
        id: '123',
        ...contentType('tag'),
        ...timestamps(),
      },
      fields: {
        name: 'Lent',
      },
    },
  },

  {
    description: 'stores a meditation with included relationships',
    apiJson: {
      items: [
        {
          sys: {
            id: '123',
            ...contentType('meditation'),
            ...timestamps(),
          },
          fields: {
            title: 'Names of God',
            description: "A meditation on the names you use and the names you don't.",
            category: {
              sys: {
                id: '1',
                ...contentType('meditationCategory'),
                ...timestamps(),
              },
              fields: {
                title: 'All Meditations',
                description: 'All the meditations.',
              },
            },
            contributors: [
              {
                sys: {
                  id: '1',
                  ...contentType('contributor'),
                  ...timestamps(),
                },
                fields: {
                  name: 'Michael Gungor',
                  twitter: '@michaelgungor',
                },
              },
            ],
            tags: [
              {
                sys: {
                  id: '4',
                  ...contentType('tag'),
                  ...timestamps(),
                },
                fields: {
                  name: 'names',
                },
              },
              {
                sys: {
                  id: '9',
                  ...contentType('tag'),
                  ...timestamps(),
                },
                fields: {
                  name: 'god',
                },
              },
            ],
          },
        },
      ],
    },
  },
];

describe('orm reducer', () => {
  let store;

  beforeEach(() => {
    ({ store } = configureStore({ noEpic: true }));
  });

  cases.forEach(({ description, apiJson, relationships }) => {
    describe(description, () => {
      let id;
      let type;
      let apiData;
      let expected;

      beforeEach(() => {
        apiData = _.isArray(apiJson.items) ? apiJson.items[0] : apiJson;
        ({
          sys: {
            id,
            contentType: {
              sys: {
                id: type,
              },
            },
          },
        } = apiData);

        store.dispatch(actions.receiveData({
          resource: type,
          id,
          json: apiJson,
        }));

        expected = {
          id,
          type,
          ...apiData.fields,
          ...getExpectedTimestamps(apiData),
          ...getExpectedRelationships(apiData),
          ...relationships,
        };
      });

      it('collection', () => {
        const collectionSelector = selectors[`${pluralize(type)}Selector`];
        const collection = collectionSelector(store.getState());
        expect(collection[0]).toEqual(expected);
      });

      it('instance', () => {
        const instanceType = getModelName(type).replace(/^\w/, c => c.toLowerCase());
        const instanceSelector = selectors[`${instanceType}Selector`];
        const instance = instanceSelector(store.getState(), apiData.sys.id);
        expect(instance).toEqual(expected);
      });
    });
  });

  it('stores reverse relationships', () => {
    const category = {
      sys: {
        id: '1',
        ...contentType('meditationCategory'),
        ...timestamps(),
      },
      fields: {
        title: 'All Meditations',
        description: 'All the meditations.',
      },
    };
    const apiJson = {
      items: [
        {
          sys: {
            id: '123',
            ...contentType('meditation'),
            ...timestamps(),
          },
          fields: {
            title: 'Names of God',
            description: "A meditation on the names you use and the names you don't.",
            category,
          },
        },
        {
          sys: {
            id: '456',
            ...contentType('meditation'),
            ...timestamps(),
          },
          fields: {
            title: 'Who are you',
            description: 'A meditation on who you think you are',
            category,
          },
        },
      ],
    };

    store.dispatch(actions.receiveData({
      resource: 'meditations',
      json: apiJson,
    }));

    const expectedMeditations = apiJson.items.map(datum => ({
      id: datum.sys.id,
      type: 'meditation',
      ...datum.fields,
      ...getExpectedTimestamps(datum),
      category: {
        id: category.sys.id,
        ...getExpectedTimestamps(category),
        ...category.fields,
      },
      tags: [],
      contributors: [],
    }));

    const meditations = selectors.meditationsSelector(store.getState());
    expect(meditations).toEqual(expectedMeditations);

    const expectedCategoryState = {
      id: category.sys.id,
      type: 'meditationCategory',
      ...category.fields,
      ...getExpectedTimestamps(category),
      meditations: expectedMeditations.map(
        m => ({
          ..._.pick(m, [
            'id',
            'type',
            'title',
            'description',
            'createdAt',
            'updatedAt',
          ]),
        }),
      ),
      tags: [],
    };
    const categoryState = selectors.meditationCategorySelector(
      store.getState(),
      category.sys.id,
    );
    expect(categoryState).toEqual(expectedCategoryState);
  });

  it('stores an API error', () => {
    const expectedError = new Error('404 OOPS LOL');
    store.dispatch(actions.receiveApiError({
      resource: 'meditations',
      error: expectedError,
    }));

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
  // These tests are very simple; one action leads to a single other.
  // Other tests that result in multiple actions from the epic
  // will have to be a little more complicated.

  describe('when API call succeeds', () => {
    const payload = {
      items: {
        fields: {
          foo: 'bar',
        },
      },
    };

    beforeEach(() => {
      // XXX: this is a gross hack and I can't believe
      // it's what the official Jest documentation recommends.
      // TODO: figure out how to do the mocking just from here,
      // on a per-test basis, without side effects.
      contentful.__setPayload(payload);
    });

    test('fetchData() leads to receiveData()', async () => {
      const args = { resource: 'foo' };

      const action$ = ActionsObservable.of(actions.fetchData(args));
      const responseAction = await epic(action$).toPromise();

      const expectedAction = actions.receiveData({
        ...args,
        json: payload,
      });
      expect(responseAction).toEqual(expectedAction);
    });
  });

  describe('when API call fails', () => {
    const error = new Error('whoops');

    beforeEach(() => {
      // TODO: get rid of this hack as well.
      contentful.__setError(error);
    });

    test('fetchData() leads to receiveApiError()', async () => {
      const args = { resource: 'foo' };

      const action$ = ActionsObservable.of(actions.fetchData(args));
      const errorAction = await epic(action$).toPromise();

      expect(errorAction.type).toEqual(types.RECEIVE_API_ERROR);
      expect(errorAction.payload.error).toBeInstanceOf(Error);
    });
  });
});
