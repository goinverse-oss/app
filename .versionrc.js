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

    // TODO: enable these when it works properly; see expo-community/standard-version-expo#9
    // TODO: NOTE: this requires two bumps per file:
    // TODO: NOTE: 1. The semver app release version
    // TODO: NOTE: 2. The build number / version code
    // {
    //   filename: 'android/app/build.gradle',
    //   updater: require.resolve('standard-version-expo/android/increment'),
    // },
    // {
    //   filename: 'ios/TheLiturgists/Info.plist',
    //   updater: require.resolve('standard-version-expo/ios/increment'),
    // }
  ]
};
