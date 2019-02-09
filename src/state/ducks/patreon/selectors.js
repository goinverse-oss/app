export function isPatron(state) {
  return state.patreon.token !== null;
}

export function loading(state) {
  return state.patreon.loading;
}

export function error(state) {
  return state.patreon.error;
}
