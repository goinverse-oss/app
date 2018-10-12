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

import axios from 'axios';
import _ from 'lodash';

import { FETCH_DATA } from './types';
import { receiveData, receiveApiError } from './actions';
import config from '../../../../config.json';

/**
 * Fetch API data.
 *
 * @return {Observable} emitting an axios response object
 */
function sendAPIRequest({ resource, id, ...options }) {
  const baseUrl = config.apiBaseUrl;
  const endpoint = _.isUndefined(id) ? resource : `${resource}/${id}`;

  const url = `${baseUrl}/${endpoint}`;
  return Observable.fromPromise(
    axios.get(url, options).then(r => r.data),
  );
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
const fetchDataEpic = action$ =>
  action$.ofType(FETCH_DATA)
    .switchMap(action => (
      sendAPIRequest(action.payload)
        .map(data => receiveData(data))
        .catch(error => Observable.of(receiveApiError(error)))
    ));

export default combineEpics(fetchDataEpic);
