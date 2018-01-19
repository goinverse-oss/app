# The Liturgists App

This is the Liturgists App for both iOS and Android built with React Native.

## Getting Started

### macOS

1. Install XCode
1. Install Homebrew
1. `brew install node`
1. `brew install yarn`
1. `brew install watchman`
1. `yarn global add react-native-cli`

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

In a second terminal

```
cd app
react-native run-ios
```

## Debugging

[react-native-debugger](https://github.com/jhen0409/react-native-debugger) is
highly recommended, as it allows you to see console logs, React structure,
Redux state and actions, and network activity all in one place, as if you were
running your app in Chrome and using its dev tools.

### macOS Quickstart

```sh
$ brew update && brew cask install react-native-debugger
```

Launch the **React Native Debugger** app (should now be in your `/Applications` folder),
then start your simulator.

Other platforms: see instructions at linked repo above.

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
$ react-native run-ios  # opens Storybook in app
```
This runs both the Storybook server and the react-native packaging server, using
an `index.js` that registers the Storybook UI instead of the app as the root.
To switch back to running the app, Ctrl-C the `yarn storybook` command, run `yarn start`
again, and 'Reload JS' in the simulator. (You may have to reload a few times.)
