import React from 'react';
import PropTypes from 'prop-types';
import { Text, View, Button } from 'react-native';
import { connect } from 'react-redux';

import * as authActions from '../state/ducks/auth/actions';
import styles from '../styles';

/**
 * Main entry point to the app for new users.
 * Prompts user to login or create an account.
 */
const LoginScreen = ({ login }) => (
  <View style={styles.container}>
    <Text>
      Placeholder login screen
    </Text>
    <Button
      onPress={() => login()}
      title="Log in"
    />
  </View>
);

LoginScreen.propTypes = {
  // callback invoked when the user clicks "Log in"
  login: PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch, { navigation }) {
  return {
    login: () => {
      dispatch(authActions.login());
      navigation.navigate('Main');
    },
  };
}

export default connect(null, mapDispatchToProps)(LoginScreen);
