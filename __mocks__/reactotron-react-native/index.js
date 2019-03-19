const reactotron = {
  configure: () => reactotron,
  useReactNative: () => reactotron,
  use: () => reactotron,
  connect: () => reactotron,
  createEnhancer: () => noop => noop,
};

module.exports = reactotron;
