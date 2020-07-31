import _ from 'lodash';

import * as authSelectors from '../auth/selectors';

export function isConnected(state) {
  return authSelectors.isAuthenticated(state);
}

export function getPledge(state) {
  // TODO: look up pledge API object from state
  // TODO before that: make sure we've fetched it
  return state?.patreon?.details;
}

export function isPatron(state) {
  const pledge = getPledge(state);
  return pledge?.isPatron || false;
}

export function canAccessPatronPodcasts(state) {
  const pledge = getPledge(state);
  return pledge?.canAccessPatronPodcasts || false;
}

export function patronPodcasts(state) {
  const pledge = getPledge(state);
  return pledge?.podcasts || [];
}

export function canAccessMeditations(state) {
  const pledge = getPledge(state);
  return pledge?.canAccessMeditations || false;
}

export function canAccessLiturgies(state) {
  const pledge = getPledge(state);
  return pledge?.canAccessLiturgies || false;
}

export function zoomRoomPasscode(state) {
  const pledge = getPledge(state);
  return pledge?.zoomRoomPasscode;
}

export function imageUrl(state) {
  return _.get(
    state.patreon,
    'details.data.attributes.image_url',
    'https://loremflickr.com/81/81?random',
  );
}

export function firstName(state) {
  return _.get(state.patreon, 'details.userData.data.attributes.first_name', '');
}

export function fullName(state) {
  return _.get(state.patreon, 'details.userData.data.attributes.full_name', 'Patreon');
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
