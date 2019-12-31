module.exports = {
  dependencies: {
    // These libraries are included in ExpoKit; autolinking them
    // results in duplicate symbol errors
    'react-native-gesture-handler': {
      platforms: {
        ios: null,
        android: null,
      },
    },
    'react-native-webview': {
      platforms: {
        ios: null,
        android: null,
      },
    },
  },
};
