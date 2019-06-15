export function getStateObservable(store) {
  // just add 'value' with the latest state
  return { value: store.getState() };
}

export function amockFileSystem() {
}
