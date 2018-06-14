import _ from 'lodash';
import jsonApi from 'jsonapi-server';
import moment from 'moment';
import { factory } from 'factory-girl';

import * as placeholders from './placeholders';

import { randomRelatedObjects } from './utils';

export default {
  title: jsonApi.Joi.string().required(),
  description: jsonApi.Joi.string(),
  imageUrl: jsonApi.Joi.string().uri(),
  mediaUrl: jsonApi.Joi.string().uri().required(),
  publishedAt: jsonApi.Joi.date(),
  status: jsonApi.Joi.string().valid('published', 'draft').required(),
  category: jsonApi.Joi.one('meditationCategory'),
  tags: jsonApi.Joi.many('tag'),
  contributors: jsonApi.Joi.many('contributor'),
  createdAt: jsonApi.Joi.date().required(),
  updatedAt: jsonApi.Joi.date(),
};

factory.define('meditation', Object, {
  id: factory.sequence('meditation.id', n => `${n}`),
  type: 'meditation',
  title: factory.chance('sentence', { words: 3 }),
  description: () => (
    _.times(3, () => (
      factory.chance('paragraph', { sentences: 3 })()
    )).join('\n\n')
  ),
  imageUrl: placeholders.imageUrl,
  mediaUrl: placeholders.mediaUrl,
  publishedAt: factory.sequence(
    'meditation.publishedAt',
    n => moment('2017-02-07').add(n, 'weeks'),
  ),
  status: 'published',
  tags: randomRelatedObjects('meditation', 'tag'),
  contributors: randomRelatedObjects('meditation', 'contributor'),
  createdAt: factory.sequence(
    'meditation.createdAt',
    n => moment('2017-02-07').add(n, 'weeks'),
  ),
});
