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
import parse from 'url-parse';

import { FETCH_DATA } from './types';
import { receiveData, receiveApiError } from './actions';
import * as patreonSelectors from '../patreon/selectors';
import config from '../../../../config.json';
import showError from '../../../showError';

/**
 * Fetch API data.
 *
 * If 'id' is provided, fetch one entry. If not,
 * fetch all entries of the specified resource type,
 * subject to the optional collection filter.
 *
 * @param {object} client contentful client object
 * @param {string} resource what to fetch; e.g. 'podcastEpisodes', 'meditations'
 * @param {string} id resource ID
 * @param {object} collection optional collection filter with keys:
 *   field: name of related resource field; e.g. 'podcast', 'category'
 *   id: ID of collection resource
 * @return {Observable} emitting an axios response object
 */
function sendAPIRequest(client, { resource, id, collection }) {
  let promise;
  if (id) {
    promise = client.getEntry(id);
  } else {
    const contentType = singular(resource);
    const filter = {};
    if (collection) {
      filter[`fields.${collection.field}.sys.id`] = collection.id;
    }
    promise = client.getEntries({ content_type: contentType, ...filter });
  }
  return Observable.fromPromise(promise);
}

function patreonAuthHeader(state) {
  const token = patreonSelectors.token(state);
  return token ? {
    'x-theliturgists-patreon-token': token,
  } : {};
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
const fetchDataEpic = (action$, store) => {
  const url = parse(config.apiBaseUrl);
  const client = state => (
    createClient({
      host: url.host,
      basePath: `${url.pathname}/contentful`,
      headers: patreonAuthHeader(state),

      // these are filled in by our backend proxy
      space: 'dummy',
      environment: 'dummy',
      accessToken: 'dummy',
    })
  );

  return action$.ofType(FETCH_DATA)
    .mergeMap(action => (
      sendAPIRequest(client(store.getState()), action.payload)
        .map(json => receiveData({
          ..._.pick(action.payload, ['resource', 'id', 'collection']),
          json,
        }))
        .catch((error) => {
          showError(error);
          return Observable.of(
            receiveApiError({
              ..._.pick(action.payload, ['resource', 'id', 'collection']),
              error,
            }),
          );
        })
    ));
};

export default combineEpics(fetchDataEpic);
