import { ofType } from 'redux-observable';

// redux-observable pulls in a minimal subset of RxJS
// to keep the bundle size small, so here we explicitly
// pull in just the things we need, including operators
// on Observable. It's a little weird, but you get used
// to the error messages that tell you you need to import
// another operator.
// https://redux-observable.js.org/docs/Troubleshooting.html
import { Observable } from 'rxjs/Observable';
import { switchMap, map, catchError } from 'rxjs/operators';

import _ from 'lodash';
import axios from 'axios';
import { AuthSession } from 'expo';
import qs from 'qs';

import config from '../../../../config.json';

import { CONNECT } from './types';
import {
  storeToken,
  storeError,
} from './actions';

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
    'https://www.patreon.com/oauth2/authorize' +
    '?response_type=code' +
    `&client_id=${config.patreonClientId}` +
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
          ).then(response => response.data.access_token);
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
        map(token => storeToken(token)),
        catchError(e => Observable.of(storeError(e))),
      )
    )),
  );

export default connectPatreonEpic;
