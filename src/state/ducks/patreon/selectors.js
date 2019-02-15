import _ from 'lodash';
import { JsonApiDataStore } from 'jsonapi-datastore';

export function token(state) {
  return state.auth.patreonToken;
}

export function isConnected(state) {
  return token(state) !== null;
}

export function getPledge(state) {
  if (!state.patreon.details) {
    return null;
  }

  const data = new JsonApiDataStore();
  data.sync(state.patreon.details);

  const userId = state.patreon.details.data.id;
  const user = data.find('user', userId);
  const pledges = user.pledges.filter(
    p => p.reward.campaign.url === 'https://www.patreon.com/bdhtest',
  );
  return pledges.length > 0 ? pledges[0] : null;
}

export function isPatron(state) {
  return getPledge(state) !== null;
}

export function canAccessPatronPodcasts(state) {
  return isPatron(state);
}

export function canAccessMeditations(state) {
  const pledge = getPledge(state);
  if (!pledge) {
    return false;
  }
  return /Meditations/i.test(pledge.reward.title);
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
