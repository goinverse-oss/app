const reactotron = {
  setAsyncStorageHandler: () => reactotron,
  configure: () => reactotron,
  useReactNative: () => reactotron,
  use: () => reactotron,
  connect: () => reactotron,
  createEnhancer: () => noop => noop,
  networking: () => reactotron,
};

module.exports = reactotron;
