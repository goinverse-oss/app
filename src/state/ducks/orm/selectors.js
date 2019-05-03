import _ from 'lodash';
import moment from 'moment';
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
            ...m,
            category: meditationCategory.ref,
            type: 'meditation',
          }),
        ),
    },
  }),
  Podcast: podcast => ({
    ...podcast.ref,
    ...{
      tags: podcast.tags.toRefArray(),
      contributors: podcast.contributors.toRefArray(),
      episodes: podcast.episodes
        .orderBy('publishedAt', 'desc')
        .toRefArray().map(
          e => ({
            ...e,
            podcast: podcast.ref,
            type: 'podcastEpisode',
          }),
        ),
      seasons: podcast.seasons
        .orderBy('number', 'asc')
        .toRefArray().map(
          s => ({
            ...s,
            podcast: podcast.ref,
            type: 'podcastSeason',
          }),
        ),
    },
  }),
  PodcastEpisode: episode => ({
    ...episode.ref, // attributes
    ...{
      // relationships
      podcast: _.get(episode, 'podcast.ref'),
      season: _.get(episode, 'season.ref'),
      contributors: episode.contributors.toRefArray(),
      tags: episode.tags.toRefArray(),
    },
  }),
  PodcastSeason: season => ({
    ...season.ref, // attributes
    ...{
      // relationships
      podcast: _.get(season, 'podcast.ref'),
      contributors: season.contributors.toRefArray(),
      tags: season.tags.toRefArray(),
      episodes: season.episodes
        .orderBy('publishedAt', 'desc')
        .toRefArray().map(
          e => ({
            ...e,
            season: season.ref,
            type: 'podcastEpisode',
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
  Meditation: [['publishedAt', 'title'], ['desc', 'asc']],
  MeditationCategory: ['title'],
  Podcast: ['title'],
  PodcastEpisode: [['publishedAt', 'title'], ['desc', 'asc']],
  PodcastSeason: ['title'],
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
export const podcastsSelector = createCollectionSelector('podcast');
export const podcastEpisodesSelector = createCollectionSelector('podcastEpisode');
export const podcastSeasonsSelector = createCollectionSelector('podcastSeason');
export const contributorsSelector = createCollectionSelector('contributor');
export const tagsSelector = createCollectionSelector('tag');

export const meditationSelector = createInstanceSelector('meditation');
export const meditationCategorySelector = createInstanceSelector('meditationCategory');
export const podcastSelector = createInstanceSelector('podcast');
export const podcastEpisodeSelector = createInstanceSelector('podcastEpisode');
export const podcastSeasonSelector = createInstanceSelector('podcastSeason');
export const contributorSelector = createInstanceSelector('contributor');
export const tagSelector = createInstanceSelector('tag');

export function collectionSelector(state, type) {
  return collectionSelectors[type](state);
}

export function filteredCollectionSelector(state, type, filterFunc = () => true) {
  const modelName = getModelName(type);
  const selector = createSelector(
    orm,
    dbStateSelector,
    session => session[modelName].all()
      .orderBy(...modelOrderArgs[modelName])
      .toModelArray()
      .filter(filterFunc)
      .map(modelToObject[modelName])
      .map(obj => ({ ...obj, type })),
  );
  return selector;
}

export function instanceSelector(state, type, id) {
  return instanceSelectors[type](state, id);
}

export const recentMediaItemsSelector = createSelector(
  orm,
  dbStateSelector,
  (session) => {
    const limit = 5;
    const podcastEpisodes = (
      session.PodcastEpisode.all()
        .orderBy('publishedAt', 'desc')
        .toModelArray()
        .map(modelToObject.PodcastEpisode)
        .map(obj => ({ ...obj, type: 'podcastEpisode' }))
        .slice(0, limit)
    );
    const meditations = (
      session.Meditation.all()
        .orderBy('publishedAt', 'desc')
        .toModelArray()
        .map(modelToObject.Meditation)
        .map(obj => ({ ...obj, type: 'meditation' }))
        .slice(0, limit)
    );
    const items = podcastEpisodes.concat(meditations);
    return items.sort((a, b) => (
      moment(b.publishedAt) - moment(a.publishedAt)
    )).slice(0, limit);
  },
);

// Contentful URLs don't have a url scheme for some reason.
export const assetUrlSelector = (state, key) => {
  const url = _.get(state, `orm.assets.${key}.fields.file.url`);
  return url ? `https:${url}` : null;
};

export const apiLoadingSelector = (state, resource) => _.get(state, ['orm.api.loading', resource], false);
export const apiErrorSelector = state => _.get(state, 'orm.api.error');
