import { handleActions } from 'redux-actions';

import orm from '../../orm';

import { RECEIVE_DATA } from './types';

const defaultState = orm.session().state;

function getModelName(type) {
  // basic singularization
  const singular = type
    .replace(/ies$/, 'y')
    .replace(/s$/, '');

  // capitalize
  return singular.charAt(0).toUpperCase() + singular.substr(1);
}

export default handleActions({
  [RECEIVE_DATA]: (state, action) => {
    const session = orm.session(state);
    action.payload.data.forEach((item) => {
      const modelName = getModelName(item.type);
      const Model = session[modelName];
      Model.upsert({
        id: item.id,
        ...item.attributes,
      });
      // TODO: handle relationships
    });
    return session.state;
  },
}, defaultState);
