export function token(state) {
  return state.auth.liturgistsToken;
}

export function isAuthenticated(state) {
  return !!token(state);
}
