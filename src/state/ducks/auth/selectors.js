export function token(state) {
  return state.auth.patreonShimToken;
}

export function isAuthenticated(state) {
  return !!token(state);
}
