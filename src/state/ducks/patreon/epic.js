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
import 'rxjs/add/operator/mapTo';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/fromPromise';

import axios from 'axios';

import { ENABLE_PATREON, DISABLE_PATREON } from './types';
import {
  patreonEnabled,
  patreonDisabled,
  patreonError,
} from './actions';

/**
 * Simulate a Patreon API success/failure (random).
 *
 * With some probability, hits either `/post` (success)
 * or `/status/429` (failure; rate limit exceeded)
 * at https://httpbin.org. Used to demonstrate how
 * to use epics to handle asynchronous actions.
 *
 * TODO: replace with a function that uses the real Patreon API.
 *
 * @return {Observable} emitting an axios response object
 */
function sendFakePatreonRequest() {
  const errorProbability = 0.4;
  const endpoint = (Math.random() < errorProbability) ? 'status/429' : 'post';

  const url = `https://httpbin.org/${endpoint}`;
  const json = { foo: 'bar' };
  return Observable.fromPromise(axios.post(url, json));
}

/*
 * XXX
 * Below is a **proposed** initial format for epic docs;
 * I couldn't find any drop-in convention. Feedback welcome,
 * and we'll probably evolve it as we add more of them.
 * XXX
 */

/**
 * Handle requests to enable Patreon.
 *
 * Handles:
 *   ENABLE_PATREON: pretend to enable Patreon
 * Emits:
 *   PATREON_ENABLED: on success
 *   PATREON_ERROR: on failure
 */
const enablePatreonEpic = action$ =>
  action$.ofType(ENABLE_PATREON)
    .switchMap(() => (
      sendFakePatreonRequest()
        .mapTo(patreonEnabled())
        .catch(error => Observable.of(patreonError(error)))
    ));

/**
 * Handle requests to disable Patreon.
 *
 * Handles:
 *   DISABLE: pretend to disable Patreon
 * Emits:
 *   PATREON_DISABLED: on success
 *   PATREON_ERROR: on failure
 */
const disablePatreonEpic = action$ =>
  action$.ofType(DISABLE_PATREON)
    .switchMap(() => (
      sendFakePatreonRequest()
        .mapTo(patreonDisabled())
        .catch(error => Observable.of(patreonError(error)))
    ));

export default combineEpics(enablePatreonEpic, disablePatreonEpic);
