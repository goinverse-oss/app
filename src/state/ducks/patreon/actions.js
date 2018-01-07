import { createAction } from 'redux-actions';

import * as types from './types';

export const enable = createAction(types.ENABLE_PATREON);
export const disable = createAction(types.DISABLE_PATREON);
