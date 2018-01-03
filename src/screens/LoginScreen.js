import React from 'react';
import PropTypes from 'prop-types';
import { Text, View, Button } from 'react-native';

import * as navActions from '../state/ducks/navigation/actions';

const LoginScreen = ({ navigation }) => (
  <View>
    <Text>
      Placeholder login screen
    </Text>
    <Button
      onPress={() => navigation.dispatch(navActions.login())}
      title="Log in"
    />
  </View>
);

LoginScreen.propTypes = {
  navigation: PropTypes.shape({
    dispatch: PropTypes.func.isRequired,
  }).isRequired,
};

export default LoginScreen;
