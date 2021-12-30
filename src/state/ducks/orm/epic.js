import { ofType, combineEpics } from 'redux-observable';

import { Alert } from 'react-native';
import { of, from } from 'rxjs';
import {
  map,
  mergeMap,
  catchError,
} from 'rxjs/operators';

import _ from 'lodash';
import { createClient } from 'contentful/dist/contentful.browser';
import { singular } from 'pluralize';
import parse from 'url-parse';

import { FETCH_DATA, FETCH_ASSET } from './types';
import { receiveData, receiveAsset, receiveApiError, ALL_MEDITATIONS_COVER_ART } from './actions';
import * as authSelectors from '../auth/selectors';
import * as patreonActions from '../patreon/actions';
import * as patreonSelectors from '../patreon/selectors';
import config from '../../../../config.json';
import showError from '../../../showError';
import { navigate } from '../../../navigation/NavigationService';

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
  return from(promise);
}

const assets = {
  [ALL_MEDITATIONS_COVER_ART]: '4fw1cG2nsTZ9Upl3jpWDVH',
};

function getAsset(client, key) {
  const id = assets[key];
  const promise = client.getAsset(id);
  return from(promise);
}

function patreonAuthHeader(state) {
  const token = authSelectors.token(state);
  return token ? {
    'x-patreonshim-token': token,
  } : {};
}

function catchApiError(state$) {
  return catchError((error) => {
    const errorAction = receiveApiError({ error });

    const actions = [errorAction];

    const errorCode = _.get(error, 'response.data.code');
    if (errorCode === 'needPatreonReauth') {
      if (patreonSelectors.isConnected(state$.value)) {
        actions.push(patreonActions.disconnect());
        Alert.alert(
          'Patreon Error',
          (
            'Oops! We had trouble verifying your Patreon account.' +
            'Please reconnect Patreon to maintain access to patron-only content.'
          ),
          [
            { text: 'Ignore' },
            { text: 'Reconnect', onPress: () => navigate('Patreon') },
          ],
        );
      }
    } else {
      showError(error);
    }
    return of(...actions);
  });
}

function contentfulClient(state) {
  const url = parse(config.apiBaseUrl);
  return createClient({
    host: url.host,
    basePath: `${url.pathname}/contentful`,
    headers: patreonAuthHeader(state),

    // these are filled in by our backend proxy
    space: 'dummy',
    environment: 'dummy',
    accessToken: 'dummy',
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
const fetchDataEpic = (action$, state$) => (
  action$.pipe(
    ofType(FETCH_DATA),
    mergeMap(action => (
      sendApiRequest(
        contentfulClient(state$.value),
        action.payload,
      ).pipe(
        map(json => receiveData({
          ..._.pick(action.payload, ['resource', 'id', 'collection']),
          json,
        })),
        catchApiError(state$),
      )
    )),
  )
);

const fetchAssetsEpic = (action$, state$) => (
  action$.pipe(
    ofType(FETCH_ASSET),
    mergeMap(action => (
      getAsset(
        contentfulClient(state$.value),
        action.payload,
      ).pipe(
        map(json => receiveAsset({ key: action.payload, asset: json })),
      )
    )),
  )
);

export default combineEpics(fetchDataEpic, fetchAssetsEpic);
