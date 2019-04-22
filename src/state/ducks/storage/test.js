import configureStore from '../../store';
import * as actions from './actions';
import * as selectors from './selectors';

describe('storage reducer', () => {
  let store;

  beforeEach(() => {
    ({ store } = configureStore({ noEpic: true }));
  });

  test('path map is initially empty', () => {
    expect(selectors.getPathMap(store.getState())).toEqual({});
  });

  test('store() stores a path', () => {
    const id = 'foo';
    const path = 'file://d/n/e';
    store.dispatch(actions.store({ id, path }));

    const actualPath = selectors.getPath(store.getState(), id);
    expect(actualPath).toEqual(path);
  });

  test('remove() removes a path', () => {
    const id = 'foo';
    const path = 'file://d/n/e';

    store.dispatch(actions.store({ id, path }));
    let actualPath = selectors.getPath(store.getState(), id);
    expect(actualPath).toEqual(path);

    store.dispatch(actions.remove(id));
    actualPath = selectors.getPath(store.getState(), id);
    expect(actualPath).toBeUndefined();
  });
});
