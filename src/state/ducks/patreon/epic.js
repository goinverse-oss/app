import { ofType, combineEpics } from 'redux-observable';

import { Observable } from 'rxjs/Observable';
import {
  switchMap,
  map,
  flatMap,
  catchError,
} from 'rxjs/operators';

import _ from 'lodash';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import { AuthSession } from 'expo';
import qs from 'qs';

import config from '../../../../config.json';

import { CONNECT, GET_DETAILS, REFRESH_ACCESS_TOKEN } from './types';
import * as actions from './actions';
import * as selectors from './selectors';
import * as ormActions from '../orm/actions';
import showError from '../../../showError';

axiosRetry(axios, {
  retries: 5,
  retryDelay: axiosRetry.exponentialDelay,
});

function generateCsrfToken() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const length = 128;
  return _.times(length, () => (
    chars[Math.floor(Math.random() * length)]
  )).join('');
}

/**
 * Execute the Patreon OAuth authentication flow.
 *
 * @return {Observable} emitting a Patreon access token
 */
function getPatreonToken() {
  const csrfToken = generateCsrfToken();
  const redirectUrl = AuthSession.getRedirectUrl();
  const authUrl = (
    `${config.apiBaseUrl}/patreon/authorize` +
    '?response_type=code' +
    `&redirect_uri=${redirectUrl}` +
    `&state=${csrfToken}`
  );
  const validateUrl = `${config.apiBaseUrl}/patreon/validate`;
  return Observable.fromPromise(
    AuthSession.startAsync({ authUrl })
      .then((result) => {
        if (
          result.type === 'success' &&
          csrfToken === result.params.state
        ) {
          return axios.post(
            validateUrl,
            qs.stringify({
              code: result.params.code,
              grant_type: 'authorization_code',
              redirect_uri: redirectUrl,
            }),
          ).then(response => response.data);
        }

        if (result.type === 'error') {
          throw new Error(result.errorCode);
        }
        const errors = {
          cancel: 'User cancelled',
          dismissed: 'Manually dismissed',
          locked: 'Auth already in progress',
        };
        throw new Error(
          _.get(errors, result.type, 'Unknown error'),
        );
      }),
  );
}

function getPatreonDetails(token) {
  return Observable.fromPromise(
    axios.get(
      'https://www.patreon.com/api/oauth2/api/current_user',
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
        params: {
          includes: 'pledges',
        },
      },
    )
      .then(response => response.data),
  );
}

function refreshPatreonAccessToken(refreshToken) {
  return Observable.fromPromise(
    axios.post(
      `${config.apiBaseUrl}/patreon/validate`,
      qs.stringify({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }),
    )
      .then(response => response.data),
  );
}

function catchApiError(retryAction) {
  return catchError((e) => {
    const errorAction = actions.storeError(e);

    if (retryAction && e.response.status === 401) {
      return Observable.of(
        actions.refreshAccessToken({
          retryAction,
          errorAction,
        }),
      );
    }

    showError(e);
    return Observable.of(errorAction);
  });
}

/**
 * Handle requests to connect Patreon.
 *
 * Handles:
 *   CONNECT: connect Patreon
 * Emits:
 *   STORE_TOKEN: on success
 *   PATREON_ERROR: on failure
 */
const connectPatreonEpic = action$ =>
  action$.pipe(
    ofType(CONNECT),
    switchMap(() => (
      getPatreonToken().pipe(
        flatMap(tokenData => ([
          actions.storeToken(tokenData),
          actions.getDetails(),
          ormActions.fetchData({ resource: 'podcastEpisode' }),
          ormActions.fetchData({ resource: 'meditation' }),
        ])),
        catchApiError(),
      )
    )),
  );

const getPatreonDetailsEpic = (action$, store) =>
  action$.pipe(
    ofType(GET_DETAILS),
    switchMap((action) => {
      const token = selectors.token(store.getState());
      if (token) {
        return getPatreonDetails(token).pipe(
          map(details => actions.storeDetails(details)),
          catchApiError(action),
        );
      }
      return Observable.never();
    }),
  );

const refreshPatreonTokenEpic = (action$, store) =>
  action$.pipe(
    ofType(REFRESH_ACCESS_TOKEN),
    switchMap((action) => {
      const { retryAction, errorAction } = action.payload;
      const refreshToken = selectors.refreshToken(store.getState());
      if (refreshToken) {
        return refreshPatreonAccessToken(refreshToken).pipe(
          flatMap(tokenData => ([
            actions.storeToken(tokenData),
            ...(retryAction ? [retryAction] : []),
          ])),
          catchError(() => {
            // TODO: report refresh error to Sentry? This is weird Patreon behavior.
            showError(errorAction.payload);
            return Observable.of(errorAction);
          }),
        );
      }
      return Observable.of(errorAction);
    }),
  );

export default combineEpics(
  connectPatreonEpic,
  getPatreonDetailsEpic,
  refreshPatreonTokenEpic,
);
