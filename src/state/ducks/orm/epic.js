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

import { FETCH_DATA } from './types';
import { receiveData, receiveApiError } from './actions';

/**
 * Simulate an API success/failure (random).
 *
 * With some probability, hits either `/post` (success)
 * or `/status/429` (failure; rate limit exceeded)
 * at https://httpbin.org. Used to demonstrate how
 * to use epics to handle asynchronous actions.
 *
 * TODO: replace with a function that uses the real API.
 *
 * @return {Observable} emitting an axios response object
 */
function sendFakeAPIRequest() {
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
 * Handle requests to fetch API data.
 *
 * Handles:
 *   FETCH_DATA: pretend to fetch API data
 * Emits:
 *   RECEIVE_DATA: on success
 *   RECEIVE_API_ERROR: on failure
 */
const fetchDataEpic = action$ =>
  action$.ofType(FETCH_DATA)
    .switchMap(() => (
      sendFakeAPIRequest()
        .mapTo(receiveData())
        .catch(error => Observable.of(receiveApiError(error)))
    ));

export default combineEpics(fetchDataEpic);
