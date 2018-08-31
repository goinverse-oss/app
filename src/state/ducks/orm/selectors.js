import _ from 'lodash';
import { createSelector } from 'redux-orm';

import orm from '../../orm';

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

const dbStateSelector = state => state.orm;

export const meditationsSelector = createSelector(
  orm,

  // The first input selector should always select the db-state.
  // Behind the scenes, `createSelector` begins a Redux-ORM session
  // with the value returned by `dbStateSelector` and passes
  // that Session instance as an argument instead.
  dbStateSelector,

  session => session.Meditation.all()
    .toModelArray()
    .map(meditation => ({
      ...meditation.ref, // attributes
      ...{
        // relationships
        category: _.get(meditation, 'category.ref'),
        contributors: meditation.contributors.toRefArray(),
        tags: meditation.tags.toRefArray(),
      },
    })),
);
