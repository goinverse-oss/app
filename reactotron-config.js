import Reactotron, { networking } from 'reactotron-react-native';
import { reactotronRedux } from 'reactotron-redux';

export default (
  Reactotron
    .configure() // controls connection & communication settings
    .use(networking())
    .useReactNative() // add all built-in react native plugins
    .use(reactotronRedux())
    .connect()
);
