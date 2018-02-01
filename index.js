import { KeepAwake, registerRootComponent } from 'expo';
import Root from './src/Root';
import storybook from './storybook';

// eslint-disable-next-line no-undef
if (__DEV__) {
  KeepAwake.activate();
}

if (process.env.REACT_NATIVE_USE_STORYBOOK) {
  registerRootComponent(storybook);
} else {
  registerRootComponent(Root);
}
