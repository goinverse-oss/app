import _ from 'lodash';
import { handleActions } from 'redux-actions';

import { STORE_PROGRESS, STORE_DOWNLOAD, REMOVE_DOWNLOAD } from './types';
import { getItemDownloadPath } from './utils';

/* storage reducer state shape:
{
  // all media items by id
  items: {
    // id: "file://path/to/file"
    str: str
  },

  resumableDownloads: {
    // id: resumable download object
    str: FileSystem.DownloadResumable
  }

  // download progress by id
  progress: {
    // id: serialized progress object
    str: {
      totalBytesWritten: number,
      totalBytesExpectedToWrite: number,
    }
  },
}
*/

const defaultState = {
  items: {},
  resumableDownloads: {},
  progress: {},
};

export default handleActions({
  [STORE_PROGRESS]: (state, action) => ({
    ...state,
    progress: {
      ...state.progress,
      [action.payload.item.id]: action.payload.progress,
    },
  }),
  [STORE_DOWNLOAD]: (state, action) => ({
    items: {
      ...state.items,
      [action.payload.id]: getItemDownloadPath(action.payload),
    },
    resumableDownloads: _.omit(state.resumableDownloads, action.payload.id),
    progress: _.omit(state.progress, action.payload.id),
  }),
  [REMOVE_DOWNLOAD]: (state, action) => ({
    items: _.omit(state.items, action.payload.id),
    resumableDownloads: _.omit(state.resumableDownloads, action.payload.id),
    progress: _.omit(state.progress, action.payload.id),
  }),
}, defaultState);
