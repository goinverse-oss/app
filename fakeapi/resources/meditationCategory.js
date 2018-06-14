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
  tags: jsonApi.Joi.many('tag'),
  meditations: jsonApi.Joi.many('meditation'),
  createdAt: jsonApi.Joi.date().required(),
  updatedAt: jsonApi.Joi.date(),
};

factory.define('meditationCategory', Object, {
  id: factory.sequence('meditationCategory.id', n => `${n}`),
  type: 'meditationCategory',
  title: factory.chance('sentence', { words: 3 }),
  description: () => (
    _.times(3, () => (
      factory.chance('paragraph', { sentences: 3 })()
    )).join('\n\n')
  ),
  imageUrl: placeholders.imageUrl,
  tags: randomRelatedObjects('meditationCategory', 'tag'),
  meditations: randomRelatedObjects('meditationCategory', 'meditation'),
  createdAt: factory.sequence(
    'meditation.createdAt',
    n => moment('2017-02-07').add(n, 'weeks'),
  ),
});
