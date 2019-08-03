import firebase from 'react-native-firebase';
import { ofType, combineEpics } from 'redux-observable';
import { REHYDRATE } from 'redux-persist';
import { Observable, of } from 'rxjs';
import { mergeMap, switchMap } from 'rxjs/operators';

import { saveToken, updatePatronNotificationSubscriptions } from './actions';
import { UPDATE_PATRON_NOTIFICATION_SUBSCRIPTIONS } from './types';
import { STORE_DETAILS } from '../patreon/types';
import { canAccessMeditations, canAccessPatronPodcasts } from '../patreon/selectors';

const publicTopicName = 'new-public-media';
const patronPodcastsTopicName = 'new-patron-podcast';
const patronMeditationsTopicName = 'new-patron-meditation';
const patronLiturgiesTopicName = 'new-patron-liturgy';

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

              console.log(`Subscribing to topic: "${publicTopicName}"`);
              messaging.subscribeToTopic(publicTopicName);
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

const updatePatronNotificationSubscriptionsEpic = (action$, state$) =>
  action$.pipe(
    ofType(UPDATE_PATRON_NOTIFICATION_SUBSCRIPTIONS),
    switchMap(() => {
      const messaging = firebase.messaging();
      if (canAccessPatronPodcasts(state$.value)) {
        console.log(`Subscribing to topic: "${patronPodcastsTopicName}"`);
        messaging.subscribeToTopic(patronPodcastsTopicName);
      } else {
        console.log(`Unsubscribing from topic: "${patronPodcastsTopicName}"`);
        messaging.unsubscribeFromTopic(patronPodcastsTopicName);
      }

      if (canAccessMeditations(state$.value)) {
        console.log(`Subscribing to topic: "${patronMeditationsTopicName}"`);
        messaging.subscribeToTopic(patronMeditationsTopicName);
        console.log(`Subscribing to topic: "${patronLiturgiesTopicName}"`);
        messaging.subscribeToTopic(patronLiturgiesTopicName);
      } else {
        console.log(`Unsubscribing from topic: "${patronMeditationsTopicName}"`);
        messaging.unsubscribeFromTopic(patronMeditationsTopicName);
        console.log(`Unsubscribing from topic: "${patronLiturgiesTopicName}"`);
        messaging.unsubscribeFromTopic(patronLiturgiesTopicName);
      }

      return Observable.never();
    }),
  );

export default combineEpics(
  registerEpic,
  onPatreonStoreDetailsEpic,
  updatePatronNotificationSubscriptionsEpic,
);
