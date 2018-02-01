# Gotchas

If you encounter and overcome a particularly strange or troublesome issue
during development, chances are that someone else will encounter it too. That
someone may even be Future You. Save them a few hours and write it down here.

## Hey, where's my simulator?

Sometimes, between dev sessions and after waking my 2016 Macbook Pro from sleep,
I'll notice that `react-native run-ios` doesn't seem to want to launch the simulator.
If I look more closely, right at the start (before it gets buried in a pile of
build output) there will be this clue:

```
We couldn't boot your defined simulator due to an already booted
simulator. We are limited to one simulator launched at a time.
```

Oh, ok, there's already a simulator running for some reason. No problem;
I'll just kill it.

```
$ ps aux | grep -c Simulator
94
```

...oh. Maybe there's a better way:

```
$ xcrun simctl list devices | grep Booted
    iPhone 6 (F6E3BE71-71A3-48CD-97CA-D7EA89C5A794) (Booted)
$ xcrun simctl shutdown F6E3BE71-71A3-48CD-97CA-D7EA89C5A794
```

Yay. (The next run of `react-native run-ios` should create a simulator window.)
