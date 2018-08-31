import configureStore from '../../store';
import * as actions from './actions';
import * as selectors from './selectors';

let store;

beforeEach(() => {
  store = configureStore({ noEpic: true });
});

describe('orm reducer', () => {
  it('stores a simple response', () => {
    const meditationApiJson = {
      data: [
        {
          id: '123',
          type: 'meditations',
          attributes: {
            title: 'Meditation 123',
            description: 'Good vibes.',
          },
        },
      ],
    };
    store.dispatch(actions.receiveData(meditationApiJson));

    const obj = selectors.meditationsSelector(store.getState());
    const meditationData = meditationApiJson.data[0];
    expect(obj[0]).toEqual({
      id: meditationData.id,
      ...meditationData.attributes,
      category: undefined,
      contributors: [],
      tags: [],
    });
  });
});
