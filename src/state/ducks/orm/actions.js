import { createAction } from 'redux-actions';

import {
  FETCH_DATA,
  FETCH_ASSET,
  RECEIVE_DATA,
  RECEIVE_ASSET,
  RECEIVE_API_ERROR,
} from './types';

// asset keys
export const ALL_MEDITATIONS_COVER_ART = 'all_meditations_cover_art';

// dispatched by views
export const fetchData = createAction(FETCH_DATA);
export const fetchAsset = createAction(FETCH_ASSET);

// emitted by epics
export const receiveData = createAction(RECEIVE_DATA);
export const receiveAsset = createAction(RECEIVE_ASSET);
export const receiveApiError = createAction(RECEIVE_API_ERROR);
