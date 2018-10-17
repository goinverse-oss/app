import jsonApi from 'jsonapi-server';
import moment from 'moment';
import { factory } from 'factory-girl';

import * as placeholders from './placeholders';

export default {
  name: jsonApi.Joi.string().required(),
  url: jsonApi.Joi.string(),
  imageUrl: jsonApi.Joi.string().uri(),
  twitter: jsonApi.Joi.string(),
  facebook: jsonApi.Joi.string(),
  createdAt: jsonApi.Joi.date().required(),
  updatedAt: jsonApi.Joi.date(),
};

factory.define('contributors', Object, {
  id: factory.sequence('contributors.id', n => `${n}`),
  type: 'contributors',
  name: factory.chance('name'),
  url: factory.chance('url', { domain: 'example.com' }),
  imageUrl: factory.sequence(
    'contributors.imageUrl',
    n => placeholders.imageUrl(n),
  ),
  facebook: () => factory.chance('twitter')().replace('@', ''),
  twitter: factory.chance('twitter'),
  createdAt: factory.sequence(
    'contributors.createdAt',
    n => moment('2017-02-07').add(n, 'weeks'),
  ),
});
