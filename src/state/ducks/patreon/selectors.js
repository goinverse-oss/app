import _ from 'lodash';

import Pledge from '@theliturgists/patreon-pledge';

import * as authSelectors from '../auth/selectors';

export function isConnected(state) {
  return authSelectors.isAuthenticated(state);
}

export function getPledge(state) {
  return new Pledge(state?.patreon?.details);
}

export function isPatron(state) {
  const pledge = getPledge(state);
  return pledge.isPatron();
}

export function canAccessPatronPodcasts(state) {
  const pledge = getPledge(state);
  return pledge.canAccessPatronPodcasts();
}

export function canAccessMeditations(state) {
  const pledge = getPledge(state);
  return pledge.canAccessMeditations();
}

export function imageUrl(state) {
  return _.get(
    state.patreon,
    'details.data.attributes.image_url',
    'https://loremflickr.com/81/81?random',
  );
}

export function firstName(state) {
  return _.get(state.patreon, 'details.data.attributes.first_name', '');
}

export function fullName(state) {
  return _.get(state.patreon, 'details.data.attributes.full_name', 'Patreon');
}

export function loading(state) {
  return state.patreon.loading;
}

export function error(state) {
  return state.patreon.error;
}

export function waitingForDeviceVerification(state) {
  return !!state.patreon.waitingForDeviceVerification;
}
