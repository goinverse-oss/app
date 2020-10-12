module.exports = {
  bumpFiles: [
    {
      filename: 'package.json',
    },
    {
      filename: 'app.json',
      updater: require.resolve('standard-version-expo'),
    },

    // Thewe keep the app.json bumpers just to keep it in sync,
    // in case we ever go back to the managed workflow, or the bare workflow
    // starts making more use of them in app.json.
    {
      filename: 'app.json',
      updater: require.resolve('standard-version-expo/android/increment'),
    },
    {
      filename: 'app.json',
      updater: require.resolve('standard-version-expo/ios/increment'),
    },

    {
      filename: 'android/app/build.gradle',
      updater: require.resolve('standard-version-expo/android/native/app-version'),
    },
    {
      filename: 'android/app/build.gradle',
      updater: require.resolve('standard-version-expo/android/native/buildnum/increment'),
    },
    {
      filename: 'ios/TheLiturgists/Info.plist',
      updater: require.resolve('standard-version-expo/ios/native/app-version'),
    },
    {
      filename: 'ios/TheLiturgists/Info.plist',
      updater: require.resolve('standard-version-expo/ios/native/buildnum/increment'),
    }
  ]
};
