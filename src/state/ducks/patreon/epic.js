import { ofType, combineEpics } from 'redux-observable';

import { of, from, never } from 'rxjs';
import {
  switchMap,
  map,
  catchError,
} from 'rxjs/operators';

import axios from 'axios';
import axiosRetry from 'axios-retry';

import config from '../../../../config.json';

import { STORE_TOKEN, DISCONNECT, GET_DETAILS } from './types';
import * as actions from './actions';
import * as authSelectors from '../auth/selectors';
import * as ormActions from '../orm/actions';
import showError from '../../../showError';

axiosRetry(axios, {
  retries: 5,
  retryDelay: axiosRetry.exponentialDelay,
});

function getPatreonDetails(token) {
  const detailsUrl = `${config.apiBaseUrl}/patron-pledge`;
  return from(
    axios.get(
      detailsUrl,
      {
        headers: {
          'x-patreonshim-token': token,
        },
      },
    )
      .then(response => response.data),
  );
}

function catchApiError() {
  return catchError((e) => {
    const errorAction = actions.storeError(e);

    showError(e);
    return of(errorAction);
  });
}

/**
 * Handle requests to connect Patreon.
 *
 * Handles:
 *   STORE_TOKEN: store token retrieved from Patreon
 * Emits:
 *   GET_DETAILS: to fetch patreon details
 *   FETCH_DATA: to refresh patron media
 */
const connectPatreonEpic = action$ =>
  action$.pipe(
    ofType(STORE_TOKEN),
    switchMap(() => (
      of(
        actions.getDetails(),
        ...['podcastEpisode', 'meditation', 'liturgyItem'].map(
          resource => ormActions.fetchData({ resource }),
        ),
      )
    )),
  );

const disconnectPatreonEpic = action$ =>
  action$.pipe(
    ofType(DISCONNECT),
    switchMap(() => of(
      ...['podcastEpisode', 'meditation', 'liturgyItem'].map(
        resource => ormActions.fetchData({ resource }),
      ),
    )),
  );

const getPatreonDetailsEpic = (action$, state$) =>
  action$.pipe(
    ofType(GET_DETAILS),
    switchMap(() => {
      const token = authSelectors.token(state$.value);
      if (token) {
        return getPatreonDetails(token).pipe(
          map(details => actions.storeDetails(details)),
          catchApiError(),
        );
      }
      return never();
    }),
  );


export default combineEpics(
  connectPatreonEpic,
  disconnectPatreonEpic,
  getPatreonDetailsEpic,
);
