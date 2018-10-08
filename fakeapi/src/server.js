#!/usr/bin/env node

/* eslint no-console: off */

import 'source-map-support/register';

import _ from 'lodash';
import { factory, ObjectAdapter } from 'factory-girl';
import jsonApi from 'jsonapi-server';

import resources from './resources';

factory.setAdapter(new ObjectAdapter());

const promises = _.map(resources, (attributes, resource) => (
  new Promise((resolve, reject) => {
    factory.buildMany(resource, 25).then((examples) => {
      jsonApi.define({
        handlers: new jsonApi.MemoryHandler(),
        resource,
        attributes,
        examples,
      });
      resolve();
    }).catch((err) => {
      console.error(err);
      reject(err);
    });
  })
));

jsonApi.setConfig({
  port: 16006,
  graphiql: true,
});

Promise.all(promises).then(() => {
  console.log('fake json:api server up at:');
  console.log(`  http://localhost:${jsonApi._apiConfig.port}`);
  jsonApi.start();
});
