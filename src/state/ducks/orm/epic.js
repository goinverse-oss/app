import { combineEpics } from 'redux-observable';

// redux-observable pulls in a minimal subset of RxJS
// to keep the bundle size small, so here we explicitly
// pull in just the things we need, including operators
// on Observable. It's a little weird, but you get used
// to the error messages that tell you you need to import
// another operator.
// https://redux-observable.js.org/docs/Troubleshooting.html
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/fromPromise';

import _ from 'lodash';
import { createClient } from 'contentful/dist/contentful.browser';
import { singular } from 'pluralize';

import { FETCH_DATA } from './types';
import { receiveData, receiveApiError } from './actions';
import config from '../../../../config.json';

/**
 * Fetch API data.
 *
 * @return {Observable} emitting an axios response object
 */
function sendAPIRequest(client, { resource, id, ...query }) {
  let promise;
  if (id) {
    promise = client.getEntry(id, query);
  } else {
    const contentType = singular(resource);
    promise = client.getEntries({ content_type: contentType, ...query });
  }
  return Observable.fromPromise(promise);
}

/**
 * Handle requests to fetch API data.
 *
 * Handles:
 *   FETCH_DATA: pretend to fetch API data
 * Emits:
 *   RECEIVE_DATA: on success
 *   RECEIVE_API_ERROR: on failure
 */
const fetchDataEpic = (action$) => {
  const client = createClient({
    ...config.contentful,
  });

  return action$.ofType(FETCH_DATA)
    .switchMap(action => (
      sendAPIRequest(client, action.payload)
        .map(json => receiveData({
          ..._.pick(action.payload, ['resource', 'id']),
          json,
        }))
        .catch(error => Observable.of(receiveApiError({
          ..._.pick(action.payload, ['resource', 'id']),
          error,
        })))
    ));
};

export default combineEpics(fetchDataEpic);
