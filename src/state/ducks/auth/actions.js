import { createAction } from 'redux-actions';

import * as types from './types';

export const login = createAction(types.LOGIN);
export const logout = createAction(types.LOGOUT);
