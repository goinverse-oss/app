import factory from 'factory-girl';
import jsonApi from 'jsonapi-server';
import moment from 'moment';

export default {
  name: jsonApi.Joi.string().required(),
  createdAt: jsonApi.Joi.date().required(),
  updatedAt: jsonApi.Joi.date(),
};

factory.define('tag', Object, {
  id: factory.sequence('tag.id', n => `${n}`),
  type: 'tag',
  name: factory.chance('word'),
  createdAt: factory.sequence(
    'meditation.createdAt',
    n => moment('2017-02-07').add(n, 'weeks'),
  ),
});
