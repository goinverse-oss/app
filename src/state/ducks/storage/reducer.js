import _ from 'lodash';
import { handleActions } from 'redux-actions';

import { STORE, REMOVE } from './types';

/* storage reducer state shape:
{
  // all media items by id
  items: {
    // id: "file://path/to/file"
    str: str
  }
}
*/

const defaultState = {
  items: {},
};

export default handleActions({
  [STORE]: (state, action) => ({
    items: {
      ...state.items,
      [action.payload.id]: action.payload.path,
    },
  }),
  [REMOVE]: (state, action) => ({
    items: _.omit(state.items, action.payload),
  }),
}, defaultState);
