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
    mergeMap((action) => {
      // delay key registration until after the previous key
      // has been rehydrated from redux-persist.
      if (action.key !== 'notifications') {
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

          firebase.notifications().onNotification((notification) => {
            console.log(notification);
          });
        },
      );
    }),
  );

// TODO: private media notifications, but only if patreon pledge gives access

export default combineEpics(registerEpic);
