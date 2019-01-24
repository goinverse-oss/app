import _ from 'lodash';
import { createSelector } from 'redux-orm';

import orm from '../../orm';
import { getModelName } from './utils';

// Selector design is largely guided by this entry in the redux-orm
// FAQ (and the corresponding linked issue):
//
// Q: "Why does my selector return old results?"
// https://github.com/tommikaikkonen/redux-orm/wiki/FAQ
// A: "Using models and relationship accessors outside of selectors is not supported
//     by design."
// https://github.com/tommikaikkonen/redux-orm/issues/218#issuecomment-402448424

// TODO: create any selectors for computed objects;
// e.g. a model and related models

// TODO: figure out lazy loading?

// The first input selector in each selector should always select the db-state.
// Behind the scenes, `createSelector` begins a Redux-ORM session
// with the value returned by `dbStateSelector` and passes
// that Session instance as an argument instead.
const dbStateSelector = state => state.orm.reduxOrm;

const modelToObject = {
  Meditation: meditation => ({
    ...meditation.ref, // attributes
    ...{
      // relationships
      category: _.get(meditation, 'category.ref'),
      contributors: meditation.contributors.toRefArray(),
      tags: meditation.tags.toRefArray(),
    },
  }),
  MeditationCategory: meditationCategory => ({
    ...meditationCategory.ref, // attributes
    ...{
      // relationships
      tags: meditationCategory.tags.toRefArray(),
      meditations: meditationCategory.meditations
        .orderBy('publishedAt', 'desc')
        .toRefArray().map(
          m => ({
            ..._.omit(m, 'category'),
            type: 'meditation',
          }),
        ),
    },
  }),
  Contributor: contributor => ({
    ...contributor.ref,
  }),
  Tag: tag => ({
    ...tag.ref,
  }),
};

const modelOrderArgs = {
  Meditation: ['publishedAt', 'desc'],
  MeditationCategory: ['title'],
  Contributor: ['name'],
  Tag: ['name'],
};

const collectionSelectors = {};
const instanceSelectors = {};

function createCollectionSelector(type) {
  const modelName = getModelName(type);
  const selector = createSelector(
    orm,
    dbStateSelector,
    session => session[modelName].all()
      .orderBy(...modelOrderArgs[modelName])
      .toModelArray()
      .map(modelToObject[modelName])
      .map(obj => ({ ...obj, type })),
  );
  collectionSelectors[type] = selector;
  return selector;
}

function createInstanceSelector(type) {
  const selector = (state, id) => {
    const modelName = getModelName(type);
    return createSelector(
      orm,
      dbStateSelector,
      (session) => {
        const instance = session[modelName].withId(id);
        if (!instance) {
          return null;
        }
        return {
          ...modelToObject[modelName](instance),
          type,
        };
      },
    )(state);
  };
  instanceSelectors[type] = selector;
  return selector;
}

export const meditationsSelector = createCollectionSelector('meditation');
export const meditationCategoriesSelector = createCollectionSelector('meditationCategory');
export const contributorsSelector = createCollectionSelector('contributor');
export const tagsSelector = createCollectionSelector('tag');

export const meditationSelector = createInstanceSelector('meditation');
export const meditationCategorySelector = createInstanceSelector('meditationCategory');
export const contributorSelector = createInstanceSelector('contributor');
export const tagSelector = createInstanceSelector('tag');

export function collectionSelector(state, type) {
  return collectionSelectors[type](state);
}

export function instanceSelector(state, type, id) {
  return instanceSelectors[type](state, id);
}

export const apiLoadingSelector = (state, resource) => _.get(state, ['orm.api.loading', resource], false);
export const apiErrorSelector = state => _.get(state, 'orm.api.error');
