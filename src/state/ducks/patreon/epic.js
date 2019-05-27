import { ofType, combineEpics } from 'redux-observable';

import { of, from, never } from 'rxjs';
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

import { CONNECT, DISCONNECT, GET_DETAILS } from './types';
import * as actions from './actions';
import * as authSelectors from '../auth/selectors';
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
  return from(
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
  const detailsUrl = `${config.apiBaseUrl}/patreon/api/current_user`;
  return from(
    axios.get(
      detailsUrl,
      {
        headers: {
          'x-theliturgists-token': token,
        },
        params: {
          includes: 'pledges',
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
          ...['podcastEpisode', 'meditation', 'liturgyItem'].map(
            resource => ormActions.fetchData({ resource }),
          ),
        ])),
        catchApiError(),
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
