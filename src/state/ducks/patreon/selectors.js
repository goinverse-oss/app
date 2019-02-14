import { JsonApiDataStore } from 'jsonapi-datastore';

export function token(state) {
  return state.auth.patreonToken;
}

export function isPatron(state) {
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

function pledgedEnough(pledge, minAmount) {
  return pledge !== null && pledge.amount_cents >= minAmount;
}

const PATRON_PODCASTS_MIN_PLEDGE = 100;
const MEDITATIONS_MIN_PLEDGE = 500;

export function canAccessPatronPodcasts(state) {
  const pledge = getPledge(state);
  return pledgedEnough(pledge, PATRON_PODCASTS_MIN_PLEDGE);
}

export function canAccessMeditations(state) {
  const pledge = getPledge(state);
  return pledgedEnough(pledge, MEDITATIONS_MIN_PLEDGE);
}

export function loading(state) {
  return state.patreon.loading;
}

export function error(state) {
  return state.patreon.error;
}
