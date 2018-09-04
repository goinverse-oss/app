import { createAction } from 'redux-actions';

import {
  FETCH_DATA,
  RECEIVE_DATA,
  RECEIVE_API_ERROR,
} from './types';

// dispatched by views
export const fetchData = createAction(FETCH_DATA);

// emitted by epics
export const receiveData = createAction(RECEIVE_DATA);
export const receiveApiError = createAction(RECEIVE_API_ERROR);
