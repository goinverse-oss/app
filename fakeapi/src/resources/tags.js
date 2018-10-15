import factory from 'factory-girl';
import jsonApi from 'jsonapi-server';
import moment from 'moment';

export default {
  name: jsonApi.Joi.string().required(),
  createdAt: jsonApi.Joi.date().required(),
  updatedAt: jsonApi.Joi.date(),
};

factory.define('tags', Object, {
  id: factory.sequence('tags.id', n => `${n}`),
  type: 'tags',
  name: factory.chance('word'),
  createdAt: factory.sequence(
    'meditation.createdAt',
    n => moment('2017-02-07').add(n, 'weeks'),
  ),
});
