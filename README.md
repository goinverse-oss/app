# The Liturgists App

This is the Liturgists App for both iOS and Android built with React Native.

## Getting Started

### macOS

1. [Install XCode](https://itunes.apple.com/us/app/xcode/id497799835)
1. Install Homebrew
1. `brew install node`
1. `brew install yarn`
1. `brew install watchman`

## Update dependencies

After first clone, and when new deps are added (i.e. if something breaks
because a package is missing):

```sh
$ yarn install   (or just 'yarn')
```

## Running Locally

### macOS

In one terminal

```
cd app
yarn start
```

You'll see a QR code in the terminal (*I know, right*).
You can then open the [Expo app] on your device and scan the QR code to load the app.
Alternatively, you can use some shortcut keys to launch a simulator and various other acitons:
```
 › Press a to open Android device or emulator, or i to open iOS emulator.
 › Press q to display QR code.
 › Press r to restart packager, or R to restart packager and clear cache.
 › Press d to toggle development mode. (current mode: development)
```
You can also use the [Expo CLI] to run various commands, such as `exp ios` to launch
the app in the iOS simulator.

[Expo app]: https://expo.io/tools#client
[Expo CLI]: https://docs.expo.io/versions/latest/guides/exp-cli.html

## Debugging

This app is hooked up to use [Reactotron] which allows you to see console
logs, Redux state and actions, and network activity all in one place. All you
need to do is follow their [installation instructions][Reactotron installation]
launch Reactotron, and reload the Expo app.

[Reactotron]: https://github.com/infinitered/reactotron/blob/master/docs/installing.md
[Reactotron installation]: https://github.com/infinitered/reactotron/blob/master/docs/installing.md

## Storybook

Storybook allows us to create a showcase of the common compoments we create for this app.
They describe these "stories" as "visual test cases". It's a quick way to see how a component
looks and behaves, in its simplest form, detached from any other functionality in the app.
It also lets us quickly iterate on styling and tweaks and see the results immediately.

To start it up:
```sh
# in one terminal
$ yarn storybook

# in another terminal
$ open http://localhost:7007  # opens Storybook web UI
```
This runs both the Storybook server and the Expo packaging server, using
an `index.js` that registers the Storybook UI instead of the app as the root.
To switch back to running the app, Ctrl-C the `yarn storybook` command, run `yarn start`
again, and 'Reload JS' in the simulator. You may have to reload a few times, or
re-scan the QR code (on device), or re-initialize the simulator (using the Expo keyboard
shortcut; e.g. `i` for iOS, `a` for Android).
