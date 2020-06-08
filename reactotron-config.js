import Reactotron, { networking } from 'reactotron-react-native';
import { reactotronRedux } from 'reactotron-redux';
import AsyncStorage from '@react-native-community/async-storage';

export default (
  Reactotron
    .setAsyncStorageHandler(AsyncStorage)
    .configure() // controls connection & communication settings
    .use(networking())
    .useReactNative() // add all built-in react native plugins
    .use(reactotronRedux())
    .connect()
);
