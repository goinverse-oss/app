import { scopedType } from '../../utils';

export const CONNECT = scopedType('patreon/CONNECT');
export const DISCONNECT = scopedType('patreon/DISCONNECT');
export const GET_DETAILS = scopedType('patreon/GET_DETAILS');
export const REFRESH_ACCESS_TOKEN = scopedType('patreon/REFRESH_ACCESS_TOKEN');

export const STORE_TOKEN = scopedType('patreon/STORE_TOKEN');
export const STORE_DETAILS = scopedType('patreon/STORE_DETAILS');
export const ERROR = scopedType('patreon/ERROR');
