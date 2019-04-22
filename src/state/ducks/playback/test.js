import { Observable } from 'rxjs';
import { REHYDRATE } from 'redux-persist';

import configureStore from '../../store';

import { SET_SOUND } from './types';
import { setPlaying, setStatus } from './actions';
import { getStatus, getLastStatusForItem } from './selectors';
import epic from './epic';
import { receiveData } from '../orm/actions';


jest.mock('expo', () => {
  class Sound {
    constructor(...args) {
      const [source, initialStatus, onPlaybackStatusUpdate] = args;
      Object.assign(this, { source, initialStatus, onPlaybackStatusUpdate });
    }

    stopAsync() {
      const status = { isPlaying: false, positionMillis: 0 };
      this.updateStatusAsync(status);
      // XXX: should probably return a promise, but we don't need it yet
    }

    updateStatusAsync(status) {
      // for testing; force status updates, but with some control
      setTimeout(() => this.onPlaybackStatusUpdate(status), 0);
    }

    static createAsync(...args) {
      return Promise.resolve({ sound: new Sound(...args) });
    }
  }

  return {
    ...jest.requireActual('expo'),
    Audio: {
      Sound,
    },
  };
});

describe('playback reducer', () => {
  let store;

  beforeEach(() => {
    ({ store } = configureStore({ noEpic: true }));
  });

  test('setStatus() stores current and per-item status', () => {
    const item = { type: 'podcastEpisode', id: '42' };
    const status = { positionMillis: 42000 };
    store.dispatch(setPlaying(item));
    store.dispatch(setStatus(status));

    const state = store.getState();
    expect(getStatus(state)).toEqual(status);
    expect(getLastStatusForItem(state, item.id)).toEqual(status);
  });
});

describe('playback epic', () => {
  const items = [
    {
      type: 'podcastEpisode',
      id: '42',
    },
    {
      type: 'podcastEpisode',
      id: '43',
    },
  ];
  const itemApiData = items.map(
    item => ({
      sys: {
        id: item.id,
        contentType: {
          sys: {
            id: item.type,
          },
        },
      },
      fields: {
        mediaUrl: 'https://example.com/url',
      },
    }),
  );

  let store;
  let inputAction$;
  let action$;
  let subscriber;

  beforeEach(async () => {
    ({ store } = configureStore({ noEpic: true }));
    const apiActions = items.map((item, i) => (
      receiveData({
        resource: item.type,
        id: item.id,
        json: itemApiData[i],
      })
    ));
    apiActions.forEach(apiAction => store.dispatch(apiAction));

    // Note: we make this multicast via share(). Otherwise, it's only the _last_
    // subscriber that receives events, and each epic in combineEpics(...)
    // subscribes to this observable in sequence.
    inputAction$ = Observable.create((s) => {
      subscriber = s;
    }).share();

    action$ = epic(inputAction$, store);
  });

  afterEach(() => {
    subscriber.complete();
    subscriber = null;
  });

  test('emits setStatus actions during playback', (done) => {
    let count = 0;
    const status = { isPlaying: true, foo: 'bar' };
    const secondStatus = { isPlaying: true, foo: 'baz' };

    const playAction = setPlaying(items[0]);
    store.dispatch(playAction);

    // subscriber is not defined until after we call action$.subscribe
    setTimeout(() => subscriber.next(playAction), 0);

    action$.subscribe((action) => {
      const assertions = [
        () => {
          expect(action.type).toEqual(SET_SOUND);
          store.dispatch(action);
          const sound = action.payload;
          expect(sound).toBeDefined();
          sound.updateStatusAsync(status);
        },
        () => {
          expect(action).toEqual(setStatus(status));
          store.dispatch(action);

          const secondPlayAction = setPlaying(items[1]);

          store.dispatch(secondPlayAction);
          subscriber.next(secondPlayAction);
        },
        () => {
          // implicitly tests that the "stop" status is _not_ emitted
          expect(action.type).toEqual(SET_SOUND);
          store.dispatch(action);
          const sound = action.payload;
          expect(sound).toBeDefined();
          sound.updateStatusAsync(secondStatus);
        },
        () => {
          expect(action).toEqual(setStatus(secondStatus));
          done();
        },
      ];
      assertions[count]();
      count += 1;
    });
  });

  test('restores initial playback status on rehydrate', (done) => {
    const status = { isPlaying: false, foo: 'bar' };
    const fakeRehydrateAction = {
      type: REHYDRATE,
      key: 'playback',
      payload: {
        sound: null,
        paused: true,
        status,
        item: items[0],
        playbackStatusPerItem: {
          [items[0].id]: status,
        },

        // XXX: redux-persist implementation-specific. yuck.
        _persist: {
          version: -1,
          rehydrated: true,
        },
      },
    };

    store.dispatch(fakeRehydrateAction);
    setTimeout(() => subscriber.next(fakeRehydrateAction), 0);

    action$.subscribe((action) => {
      expect(action).toEqual(setPlaying(items[0], false));
      store.dispatch(action);
      done();
    });
  });
});
