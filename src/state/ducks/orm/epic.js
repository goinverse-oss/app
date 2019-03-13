import { ofType, combineEpics } from 'redux-observable';

// redux-observable pulls in a minimal subset of RxJS
// to keep the bundle size small, so here we explicitly
// pull in just the things we need, including operators
// on Observable. It's a little weird, but you get used
// to the error messages that tell you you need to import
// another operator.
// https://redux-observable.js.org/docs/Troubleshooting.html
import { Observable } from 'rxjs/Observable';
import {
  map,
  mergeMap,
  catchError,
} from 'rxjs/operators';

import _ from 'lodash';
import { createClient } from 'contentful/dist/contentful.browser';
import { singular } from 'pluralize';
import parse from 'url-parse';

import { FETCH_DATA } from './types';
import { receiveData, receiveApiError } from './actions';
import * as patreonActions from '../patreon/actions';
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
function sendApiRequest(client, { resource, id, collection }) {
  let promise;
  if (id) {
    promise = client.getEntry(id);
  } else {
    const contentType = singular(resource);
    const filter = {};
    if (collection) {
      filter[`fields.${collection.field}.sys.id`] = collection.id;
    }

    promise = client.getEntries({
      content_type: contentType,
      limit: 1000,
      ...filter,
    });
  }
  return Observable.fromPromise(promise);
}

function patreonAuthHeader(state) {
  const token = patreonSelectors.token(state);
  return token ? {
    'x-theliturgists-patreon-token': token,
  } : {};
}

function catchApiError(retryAction) {
  return catchError((error) => {
    const errorAction = receiveApiError({
      ..._.pick(retryAction.payload, ['resource', 'id', 'collection']),
      error,
    });

    if (retryAction && error.response.status === 401) {
      // Patreon token has expired; try (once) to refresh it,
      // then retry the related action
      return Observable.of(
        patreonActions.refreshAccessToken({
          retryAction,
          errorAction,
        }),
      );
    }

    showError(error);
    return Observable.of(errorAction);
  });
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

  return action$.pipe(
    ofType(FETCH_DATA),
    mergeMap(action => (
      sendApiRequest(
        client(store.getState()),
        action.payload,
      ).pipe(
        map(json => receiveData({
          ..._.pick(action.payload, ['resource', 'id', 'collection']),
          json,
        })),
        catchApiError(action),
      )
    )),
  );
};

export default combineEpics(fetchDataEpic);
