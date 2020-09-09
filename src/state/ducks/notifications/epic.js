import messaging from '@react-native-firebase/messaging';
import { ofType, combineEpics } from 'redux-observable';
import { REHYDRATE } from 'redux-persist';
import { Observable, of } from 'rxjs';
import { mergeMap, switchMap } from 'rxjs/operators';

import { saveToken, updatePatronNotificationSubscriptions } from './actions';
import { UPDATE_PATRON_NOTIFICATION_SUBSCRIPTIONS } from './types';
import { STORE_DETAILS, DISCONNECT } from '../patreon/types';
import { canAccessMeditations, patronPodcasts } from '../patreon/selectors';

import config from '../../../../config.json';

const publicTopicName = 'new-public-media';
const patronPodcastsTopicName = 'new-patron-podcast';
const patronMeditationsTopicName = 'new-patron-meditation';
// const patronLiturgiesTopicName = 'new-patron-liturgy';

function subscribe(topic) {
  const scope = config.notificationScope;
  const scopedTopic = `${topic}-${scope}`;
  messaging().subscribeToTopic(scopedTopic);

  // Unsubscribe old clients from the unscoped topic after upgrade
  messaging().unsubscribeFromTopic(topic);
}

function unsubscribe(topic) {
  const scope = config.notificationScope;
  const scopedTopic = `${topic}-${scope}`;
  messaging().unsubscribeFromTopic(scopedTopic);

  // Keep unsubscribing from unscoped topic for a while to allow
  // all clients to upgrade. Can remove before launch.
  messaging().unsubscribeFromTopic(topic);
}

const registerEpic = action$ =>
  action$.pipe(
    ofType(REHYDRATE),
    mergeMap(({ key }) => {
      // delay key registration until after the previous key
      // has been rehydrated from redux-persist.
      if (key !== 'notifications') {
        return Observable.never();
      }

      return Observable.create(
        (subscriber) => {
          messaging().registerDeviceForRemoteMessages()
            .then(() => messaging().getToken())
            .then((token) => {
              subscriber.next(saveToken(token));
              subscriber.next(updatePatronNotificationSubscriptions());
              messaging().onTokenRefresh(
                newToken => subscriber.next(saveToken(newToken)),
              );

              subscribe(publicTopicName);
            })
            .then(() => messaging().requestPermission());
        },
      );
    }),
  );

const onPatreonStoreDetailsEpic = action$ =>
  action$.pipe(
    ofType(STORE_DETAILS),
    switchMap(() => of(updatePatronNotificationSubscriptions())),
  );

const onPatreonDisconnectEpic = action$ =>
  action$.pipe(
    ofType(DISCONNECT),
    switchMap(() => of(updatePatronNotificationSubscriptions())),
  );

const updatePatronNotificationSubscriptionsEpic = (action$, state$) =>
  action$.pipe(
    ofType(UPDATE_PATRON_NOTIFICATION_SUBSCRIPTIONS),
    switchMap(() => {
      const subscribeTopics = [];
      const unsubscribeTopics = [];

      if (patronPodcasts(state$.value).length > 0) {
        subscribeTopics.push(patronPodcastsTopicName);
      } else {
        unsubscribeTopics.push(patronPodcastsTopicName);
      }

      if (canAccessMeditations(state$.value)) {
        subscribeTopics.push(patronMeditationsTopicName);
      } else {
        unsubscribeTopics.push(patronMeditationsTopicName);
      }


      subscribeTopics.forEach((topic) => {
        subscribe(topic);
      });

      unsubscribeTopics.forEach((topic) => {
        unsubscribe(topic);
      });

      return Observable.never();
    }),
  );

export default combineEpics(
  registerEpic,
  onPatreonStoreDetailsEpic,
  onPatreonDisconnectEpic,
  updatePatronNotificationSubscriptionsEpic,
);
