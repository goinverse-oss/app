import { combineEpics } from 'redux-observable';
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

function sendFakePatreonRequest() {
  const errorProbability = 0.4;
  const endpoint = (Math.random() < errorProbability) ? 'status/429' : 'post';

  const url = `https://httpbin.org/${endpoint}`;
  const json = { foo: 'bar' };
  return Observable.fromPromise(axios.post(url, json));
}

const enablePatreonEpic = action$ =>
  action$.ofType(ENABLE_PATREON)
    .switchMap(() => (
      sendFakePatreonRequest()
        .mapTo(patreonEnabled())
        .catch(error => Observable.of(patreonError(error)))
    ));

const disablePatreonEpic = action$ =>
  action$.ofType(DISABLE_PATREON)
    .switchMap(() => (
      sendFakePatreonRequest()
        .mapTo(patreonDisabled())
        .catch(error => Observable.of(patreonError(error)))
    ));

export default combineEpics(enablePatreonEpic, disablePatreonEpic);
