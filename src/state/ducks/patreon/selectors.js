import _ from 'lodash';

import { CAMPAIGN_URL, NEW_TIER_REWARD_IDS, OLD_TIER_REWARD_IDS } from './constants';
import * as authSelectors from '../auth/selectors';

export function isConnected(state) {
  return authSelectors.isAuthenticated(state);
}

export function getPledge(state) {
  if (!state.patreon.user) {
    return null;
  }

  const user = state.patreon.user;
  const pledges = user.pledges.filter(
    p => p.reward.campaign.url === CAMPAIGN_URL,
  );
  return pledges.length > 0 ? pledges[0] : null;
}

export function isPatron(state) {
  const pledge = getPledge(state);
  return pledge !== null && pledge?.reward?.id !== OLD_TIER_REWARD_IDS.NON_MEMBER;
}

export function isOldTierPledge(pledge) {
  return pledge?.reward?.id === OLD_TIER_REWARD_IDS.MEMBER;
}

export function isNewTierPledge(pledge) {
  const rewardId = pledge?.reward?.id;
  return rewardId && Object.values(NEW_TIER_REWARD_IDS).find(newTierId => newTierId === rewardId);
}

export function canAccessPatronPodcasts(state) {
  const pledge = getPledge(state);
  if (isOldTierPledge(pledge)) {
    const minOldPatronPodcastsPledge = 100;
    return pledge.amount_cents >= minOldPatronPodcastsPledge;
  }

  if (isNewTierPledge(pledge)) {
    const minNewPatronPodcastsPledge = 300;
    return pledge.amount_cents >= minNewPatronPodcastsPledge;
  }

  return false;
}

export function canAccessMeditations(state) {
  const pledge = getPledge(state);

  if (isOldTierPledge(pledge)) {
    const minOldMeditationsPledge = 500;
    return pledge.amount_cents >= minOldMeditationsPledge;
  }

  if (isNewTierPledge(pledge)) {
    const minNewMeditationsPledge = 1000;
    return pledge.amount_cents >= minNewMeditationsPledge;
  }

  return false;
}

export function imageUrl(state) {
  return _.get(
    state.patreon,
    'rawPayload.data.attributes.image_url',
    'https://loremflickr.com/81/81?random',
  );
}

export function firstName(state) {
  return _.get(state.patreon, 'rawPayload.data.attributes.first_name', '');
}

export function fullName(state) {
  return _.get(state.patreon, 'rawPayload.data.attributes.full_name', 'Patreon');
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
