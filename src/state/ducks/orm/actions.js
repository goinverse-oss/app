import { createAction } from 'redux-actions';

import {
  FETCH_DATA,
  RECEIVE_DATA,
} from './types';

export const fetchData = createAction(FETCH_DATA);
export const receiveData = createAction(RECEIVE_DATA);
