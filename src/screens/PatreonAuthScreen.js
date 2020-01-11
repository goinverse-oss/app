import React, { useState, useEffect } from 'react';

import _ from 'lodash';
import qs from 'qs';
import axios from 'axios';
import { useDispatch } from 'react-redux';

import { Linking } from 'expo';
import { WebView } from 'react-native-webview';

import config from '../../config.json';

import appPropTypes from '../propTypes';
import { storeToken } from '../state/ducks/patreon/actions';

/*
 * TODO:
 * - WebView that opens the Patreon auth URL
 * - Injected javascript to remove the "sign up" links
 * - On successful auth, store the token via dispatch
 *   and navigate back to the PatreonScreen
 */

function generateCsrfToken() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const length = 128;
  return _.times(length, () => (
    chars[Math.floor(Math.random() * length)]
  )).join('');
}

const redirectPath = 'patreon/resolve';
const redirectUrl = Linking.makeUrl(redirectPath);

// Piggyback on AuthSession's implementation to avoid whitelisting
// multiple redirect URLs with Patreon.
const expoRedirectUrl = 'https://auth.expo.io/@theliturgists/app';
const expoStartUrl = `${expoRedirectUrl}/start`;

function getAuthUrl(csrfToken) {
  const patreonAuthUrl = (
    `${config.apiBaseUrl}/patreon/authorize` +
    '?response_type=code' +
    `&redirect_uri=${expoRedirectUrl}` +
    `&state=${csrfToken}`
  );
  const query = qs.stringify({
    authUrl: patreonAuthUrl,
    returnUrl: redirectUrl,
  });
  return `${expoStartUrl}?${query}`;
}

const PatreonAuthScreen = ({ navigation }) => {
  const [csrfToken, setCsrfToken] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (csrfToken === null) {
      setCsrfToken(generateCsrfToken());
    }
    const handleLink = (event) => {
      const { url } = event;
      const validateUrl = `${config.apiBaseUrl}/patreon/validate`;

      const queryString = url.replace(/.*\?/, '');
      const params = qs.parse(queryString);

      if (csrfToken === params.state) {
        return axios.post(
          validateUrl,
          qs.stringify({
            code: params.code,
            grant_type: 'authorization_code',
            redirect_uri: expoRedirectUrl,
          }),
        )
          .then(response => response.data)
          .then((data) => {
            dispatch(storeToken(data));
            navigation.goBack();
          });
      }

      const msg = 'Got link event without expected token';
      console.error(msg, event);
      throw new Error(msg);
    };

    Linking.addEventListener('url', handleLink);
    return () => { Linking.removeEventListener('url', handleLink); };
  });

  const injectedJS = `
    (() => {
      function log(msg) {
        window.ReactNativeWebView.postMessage(msg);
      }

      try {
        let buttons = Array.from(document.querySelectorAll('button'));
        buttons.forEach(button => {
          [/Google/, /Facebook/].forEach(rx => {
            if (rx.test(button.textContent)) {
              button.remove();
            }
          });
          if (button.textContent === 'Sign up' && button.parentNode) {
            button.parentNode.remove();
          }
        });
        let paragraphs = Array.from(document.querySelectorAll('p'));
        paragraphs.forEach(p => {
          if (p.textContent == 'or' && p.parentNode) {
            p.parentNode.remove();
          }
        });
        let menuButton = document.querySelector(
          'div[title="Mobile navigation menu button"]'
        );
        if (menuButton && menuButton.parentNode) {
          menuButton.parentNode.remove();
        }

        let links = Array.from(document.querySelectorAll('a'));
        links.forEach(link => { link.onclick = () => false });
      } catch (e) {
        log('ERROR: ' + e.message);
      }
    })();
  `;

  return csrfToken && (
    <WebView
      source={{ uri: getAuthUrl(csrfToken) }}
      injectedJavaScript={injectedJS}
      onMessage={event => console.log(event.nativeEvent.data)}
    />
  );
};

PatreonAuthScreen.propTypes = {
  navigation: appPropTypes.navigation.isRequired,
};

export default PatreonAuthScreen;
