import jsonApi from 'jsonapi-server';
import moment from 'moment';
import { factory } from 'factory-girl';

export default {
  name: jsonApi.Joi.string().required(),
  url: jsonApi.Joi.string(),
  twitter: jsonApi.Joi.string(),
  facebook: jsonApi.Joi.string(),
  createdAt: jsonApi.Joi.date().required(),
  updatedAt: jsonApi.Joi.date(),
};

factory.define('contributor', Object, {
  id: factory.sequence('contributor.id', n => `${n}`),
  type: 'contributor',
  name: factory.chance('name'),
  url: factory.chance('url', { domain: 'example.com' }),
  facebook: () => factory.chance('twitter')().replace('@', ''),
  twitter: factory.chance('twitter'),
  createdAt: factory.sequence(
    'meditation.createdAt',
    n => moment('2017-02-07').add(n, 'weeks'),
  ),
});
