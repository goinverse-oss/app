import { createAction } from 'redux-actions';

import * as types from './types';

export const enable = createAction(types.ENABLE_PATREON);
export const disable = createAction(types.DISABLE_PATREON);

export const patreonEnabled = createAction(types.PATREON_ENABLED);
export const patreonDisabled = createAction(types.PATREON_DISABLED);
export const patreonError = createAction(types.PATREON_ERROR);
