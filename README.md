# Media Catalog Mobile App

This is an app for making media available to supporters of an organization,
for both iOS and Android, built with React Native.

## Getting Started

### macOS

1. Set up for iOS builds:
   1. Install [XCode](https://itunes.apple.com/us/app/xcode/id497799835) and [Android Studio & SDK](https://developer.android.com/studio)
   1. Install [Cocoapods](https://cocoapods.org/)
1. Set up for Android builds:
   1. Install the [Android NDK](https://developer.android.com/ndk/guides)
   1. Open `android/local.properties` and add this line:

          # Note: substitute the actual path to your sdk folder
          ndk.dir=/path/to/android/sdk/ndk/<version>

   1. Generate your Android `debug.keystore` for signing debug builds:

          $ cd android
          $ keytool \
              -genkey -v -keystore debug.keystore \
              -storepass android -alias androiddebugkey \
              -keypass android -keyalg RSA -keysize 2048 -validity 10000

          <answer questions however you like>

1. Install [Homebrew](https://brew.sh/)
1. `brew install node`
1. `brew install watchman`

## Update dependencies

After first clone, and when new deps are added (i.e. if something breaks
because a package is missing):

```sh
$ npm install
```

This will also run `pod install` in the `ios` directory to ensure iOS native
libraries are up to date.

## Running Locally

### macOS

In one terminal:

```
$ npm start
```

In another terminal:

```
# To open the iOS simulator and install + start the app:
$ npm run ios

# To open the Android emulator:
$ export ANDROID_HOME=/path/to/android/sdk
$ ./scripts/launch-android-emulator

# To build and install the app:
$ npm run android
```

## Debugging

### Method 1: Chrome / React Native Debugger

1. Install [React Native Debugger](https://github.com/jhen0409/react-native-debugger)
   (optional, but recommended) and run `npm install` to set it up
1. [Open the debug menu](https://facebook.github.io/react-native/docs/debugging#accessing-the-in-app-developer-menu)
    and select "Debug Remote JS".

### Method 2: Reactotron

This app is also hooked up to use [Reactotron] which allows you to see console
logs, Redux state and actions, and network activity all in one place. All you
need to do is follow their [installation instructions][Reactotron installation]
launch Reactotron, and reload the app.

[Reactotron]: https://github.com/infinitered/reactotron/blob/master/docs/installing.md
[Reactotron installation]: https://github.com/infinitered/reactotron/blob/master/docs/installing.md

## Storybook

**Warning: possibly out-of-date since ejecting from Expo**

Storybook allows us to create a showcase of the common compoments we create for this app.
They describe these "stories" as "visual test cases". It's a quick way to see how a component
looks and behaves, in its simplest form, detached from any other functionality in the app.
It also lets us quickly iterate on styling and tweaks and see the results immediately.

To start it up:
```sh
# in one terminal
$ npm run storybook

# in another terminal
$ open http://localhost:7007  # opens Storybook web UI
```
This runs both the Storybook server and the Expo packaging server, using
an `index.js` that registers the Storybook UI instead of the app as the root.
To switch back to running the app, Ctrl-C the `npm run storybook` command, run `npm start`
again, and 'Reload JS' in the simulator. You may have to reload a few times, or
re-scan the QR code (on device), or re-initialize the simulator (using the Expo keyboard
shortcut; e.g. `i` for iOS, `a` for Android).

## Releasing the app

The app has two components that we release:

- The app that we publish in Apple/Google app stores
- The over-the-air javascript-only updates that we publish to Expo

Javascript-only updates are published to Expo on every push to `master`.
To ensure that we don't push JS changes that are incompatible with the latest
version in the app stores, we tie the Expo release channel to the related version of
the app. The basic strategy we use is this:

- Any semver release is a new app store version
- Only major releases require a new expo release channel
- Beta releases are simply new versions with a -beta.N tag, where N is the build number.

The app uses standard-release to create new release tags and generate changelogs.
When a release tag is pushed, a Github Action will trigger based on the tag name,
which will handle automated release tasks. For instance, `npm run release:beta`
will create a tag that, when pushed, will be deployed to TestFlight and the
Google Play beta track.

If you have access to push new tags, preparing a new release goes like this:

```
# Update changelog, bump version, and tag the release
npm run release:beta  # for beta testing; OR
npm run release       # for a new production release

# Push the new release to Github, triggering release jobs
git push --tags
```

After the new tag is pushed, someone with permission to approve deploys to
the protected environments for the release type will need to manually approve
the releases in the Github UI. After this is done, the new build will appear
in App Store Connect and Google Play Console.

NOTE: production release (non-beta) is not yet implemented, but it should be a
relatively straightforward clone of the `beta.yml` action.

### Setup required for Github Actions

There are a few steps required when setting up a new fork of this app. These will
enable Github Actions to build and publish the app to the app stores, as well as
publishing over-the-air updates (for your Javascript code) to Expo.

1. Set up an [Expo] organization and project for the app.
1. Create your app in [App Store Connect] (iOS) and [Google Play Console] (Android).
1. Create a dedicated CI user in App Store Connect; save the username and pasword somewhere safe.
1. Create a [service account] in Google Play; save the JSON configuration object somewhere safe.
1. Create a [Sentry] account for tracking errors. You'll need an [auth token] as well.
1. Once you've cloned this repo, create a **private** repo on Github; this will be used
   with `fastlane match` to store your iOS signing certificates, Then, run these steps:
   ```
   cd ios
   bundle install
   bundle exec fastlane match
   ```
   Follow the [first-time setup instructions], using the private Git repo you created.

[Expo]: https://expo.dev
[App Store Connect]: https://appstoreconnect.apple.com/
[Google Play Console]: https://play.google.com/console
[service account]: https://developers.google.com/android-publisher/getting_started#using_a_service_account
[Sentry]: https://sentry.io/
[auth token]: https://docs.sentry.io/product/integrations/integration-platform/#internal-integrations
[first-time setup instructions]: https://docs.fastlane.tools/actions/match/#usage

### Secrets required for Github Actions

| Secret name | Value |
| ---- | ---- |
| `ANDROID_RELEASE_KEYSTORE_BASE64` | Base64-encoded keystore file to use with your release builds | 
| `ANDROID_RELEASE_PASSWORD` | Password for decrypting the release keystore | 
| `EXPO_USERNAME` | Expo username for `expo publish` commands | 
| `EXPO_PASSWORD` | Password for `$EXPO_USERNAME` | 
| `FASTLANE_MATCH_DEPLOY_PRIVATE_KEY` | Private key for a deploy keypair that can read the fastlane keys repo | 
| `FASTLANE_MATCH_PASSWORD` | Password you used to encrypt the keys repo | 
| `FASTLANE_USER` | App Store Connect username, for use with Fastlane uploads | 
| `FASTLANE_PASSWORD` | Password for `$FASTLANE_USER` | 
| `GOOGLE_PLAY_JSON_BASE64` | Base64-encoded JSON object you got when you created the service account | 
| `SENTRY_AUTH_TOKEN` | Auth token for Sentry internal integration | 
