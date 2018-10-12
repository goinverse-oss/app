import _ from 'lodash';
import jsonApi from 'jsonapi-server';
import moment from 'moment';
import { factory } from 'factory-girl';

import * as placeholders from './placeholders';

import { randomRelatedObject, randomRelatedObjects } from './utils';

export default {
  title: jsonApi.Joi.string().required(),
  description: jsonApi.Joi.string(),
  imageUrl: jsonApi.Joi.string().uri(),
  mediaUrl: jsonApi.Joi.string().uri().required(),
  publishedAt: jsonApi.Joi.date(),
  status: jsonApi.Joi.string().valid('published', 'draft').required(),
  category: jsonApi.Joi.one('meditationCategories'),
  tags: jsonApi.Joi.many('tags'),
  contributors: jsonApi.Joi.many('contributors'),
  createdAt: jsonApi.Joi.date().required(),
  updatedAt: jsonApi.Joi.date(),
};

factory.define('meditations', Object, {
  id: factory.sequence('meditations.id', n => `${n}`),
  type: 'meditations',
  title: factory.chance('sentence', { words: 3 }),
  description: () => (
    _.times(3, () => (
      factory.chance('paragraph', { sentences: 3 })()
    )).join('\n\n')
  ),
  imageUrl: placeholders.imageUrl,
  mediaUrl: placeholders.mediaUrl,
  publishedAt: factory.sequence(
    'meditations.publishedAt',
    n => moment().subtract(n, 'weeks'),
  ),
  status: 'published',
  category: randomRelatedObject('meditations', 'meditationCategories', 1, 5),
  tags: randomRelatedObjects('meditations', 'tags', 3),
  contributors: randomRelatedObjects('meditations', 'contributors'),
  createdAt: factory.sequence(
    'meditations.createdAt',
    n => moment().subtract(n, 'weeks'),
  ),
});
