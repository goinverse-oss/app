import firebase from 'react-native-firebase';
import { ofType, combineEpics } from 'redux-observable';
import { REHYDRATE } from 'redux-persist';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { saveToken } from './actions';

const topicName = 'new-public-media';

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
              messaging.onTokenRefresh(
                newToken => subscriber.next(saveToken(newToken)),
              );

              messaging.subscribeToTopic(topicName);
            });

          messaging.hasPermission()
            .then((enabled) => {
              if (!enabled) {
                messaging.requestPermission();
              }
            });

          const channel = new firebase.notifications.Android.Channel(
            'main',
            'Main',
            firebase.notifications.Android.Importance.Default,
          ).setDescription('The Liturgists App Notifications');

          // Create the channel
          firebase.notifications().android.createChannel(channel);
        },
      );
    }),
  );

// TODO: private media notifications, but only if patreon pledge gives access

export default combineEpics(registerEpic);
