import { createAction } from 'redux-actions';

import * as types from './types';

// Mark the user as authenticated.
export const login = createAction(types.LOGIN);

// Mark the user as unauthenticated.
export const logout = createAction(types.LOGOUT);
