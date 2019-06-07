import { registerRootComponent } from 'expo';
import Constants from 'expo-constants';
import { activateKeepAwake } from 'expo-keep-awake';
import _ from 'lodash';

import './reactotron-config';

import Root from './src/Root';
import storybook from './storybook';

// eslint-disable-next-line no-undef
if (__DEV__) {
  activateKeepAwake();
}

function shouldUseStorybook() {
  if (process.env.REACT_NATIVE_USE_STORYBOOK) {
    return true;
  }

  const releaseChannel = _.get(Constants, 'manifest.releaseChannel', 'dev');
  return releaseChannel.indexOf('storybook') !== -1;
}

if (shouldUseStorybook()) {
  registerRootComponent(storybook);
} else {
  registerRootComponent(Root);
}
