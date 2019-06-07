import _ from 'lodash';
import { Observable, of } from 'rxjs';
import { share, take } from 'rxjs/operators';
import { REHYDRATE } from 'redux-persist';

import configureStore from '../../store';

import { SET_SOUND } from './types';
import { setPlaying, setStatus } from './actions';
import { getStatus, getLastStatusForItem } from './selectors';
import epic from './epic';
import { receiveData } from '../orm/actions';
import { START_DOWNLOAD } from '../storage/types';
import { getStateObservable } from '../testUtils';


jest.mock('expo-av', () => {
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
    ...jest.requireActual('expo-av'),
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
  });

  test('emits setStatus actions during playback', (done) => {
    // Note: we make this multicast via share(). Otherwise, it's only the _last_
    // subscriber that receives events, and each epic in combineEpics(...)
    // subscribes to this observable in sequence.
    inputAction$ = Observable.create((s) => {
      subscriber = s;
    }).pipe(share());

    const action$ = epic(inputAction$, getStateObservable(store));

    let count = 0;
    const status = { isPlaying: true, foo: 'bar' };
    const secondStatus = { isPlaying: true, foo: 'baz' };

    const playAction = setPlaying(items[0]);
    store.dispatch(playAction);

    // subscriber is not defined until after we call action$.subscribe
    setTimeout(() => subscriber.next(playAction), 1000);

    const assertDownloadAction = (action, expectedItem) => {
      expect(action.type).toEqual(START_DOWNLOAD);
      const item = action.payload;
      expect(item).toBeDefined();
      expect(_.pick(item, ['id', 'type'])).toEqual(_.pick(expectedItem, ['id', 'type']));
    };

    action$.subscribe((action) => {
      const assertions = [
        () => assertDownloadAction(action, items[0]),
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
        () => assertDownloadAction(action, items[1]),
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

      // increment count first, because this callback can be called again
      // before it returns
      count += 1;
      assertions[count - 1]();
    });
  });

  test('restores initial playback status on rehydrate', async () => {
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
    const action$ = epic(of(fakeRehydrateAction), getStateObservable(store));

    const action = await action$.pipe(take(1)).toPromise();
    expect(action).toEqual(setPlaying(items[0], false));
  });
});
