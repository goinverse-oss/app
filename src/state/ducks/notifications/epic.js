import firebase from 'react-native-firebase';
import { ofType, combineEpics } from 'redux-observable';
import { REHYDRATE } from 'redux-persist';
import { Observable, of } from 'rxjs';
import { mergeMap, switchMap } from 'rxjs/operators';

import { saveToken, updatePatronNotificationSubscriptions } from './actions';
import { UPDATE_PATRON_NOTIFICATION_SUBSCRIPTIONS } from './types';
import { STORE_DETAILS, DISCONNECT } from '../patreon/types';
import { canAccessMeditations, canAccessPatronPodcasts } from '../patreon/selectors';

import config from '../../../../config.json';

const publicTopicName = 'new-public-media';
const patronPodcastsTopicName = 'new-patron-podcast';
const patronMeditationsTopicName = 'new-patron-meditation';
// const patronLiturgiesTopicName = 'new-patron-liturgy';

function subscribe(messaging, topic) {
  const scope = config.notificationScope;
  const scopedTopic = `${topic}-${scope}`;
  console.log(`Subscribing to topic: "${scopedTopic}"`);
  messaging.subscribeToTopic(scopedTopic);

  // Unsubscribe old clients from the unscoped topic after upgrade
  messaging.unsubscribeFromTopic(topic);
}

function unsubscribe(messaging, topic) {
  const scope = config.notificationScope;
  const scopedTopic = `${topic}-${scope}`;
  console.log(`Unsubscribing from topic: "${scopedTopic}"`);
  messaging.unsubscribeFromTopic(scopedTopic);

  // Keep unsubscribing from unscoped topic for a while to allow
  // all clients to upgrade. Can remove before launch.
  messaging.unsubscribeFromTopic(topic);
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
          const messaging = firebase.messaging();

          messaging.getToken()
            .then((token) => {
              subscriber.next(saveToken(token));
              subscriber.next(updatePatronNotificationSubscriptions());
              messaging.onTokenRefresh(
                newToken => subscriber.next(saveToken(newToken)),
              );

              subscribe(messaging, publicTopicName);
            });

          messaging.hasPermission()
            .then((enabled) => {
              if (!enabled) {
                messaging.requestPermission();
              }
            });
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
      const messaging = firebase.messaging();
      const subscribeTopics = [];
      const unsubscribeTopics = [];

      if (canAccessPatronPodcasts(state$.value)) {
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
        subscribe(messaging, topic);
      });

      unsubscribeTopics.forEach((topic) => {
        unsubscribe(messaging, topic);
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
