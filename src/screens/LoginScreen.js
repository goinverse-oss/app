import React from 'react';
import PropTypes from 'prop-types';
import { Text, View, Button } from 'react-native';
import { connect } from 'react-redux';

import * as navActions from '../state/ducks/navigation/actions';
import * as authActions from '../state/ducks/auth/actions';
import styles from '../styles';

const LoginScreen = ({ navigation, login }) => (
  <View style={styles.container}>
    <Text>
      Placeholder login screen
    </Text>
    <Button
      onPress={() => {
        login();
        navigation.dispatch(navActions.login());
      }}
      title="Log in"
    />
  </View>
);

LoginScreen.propTypes = {
  navigation: PropTypes.shape({
    dispatch: PropTypes.func.isRequired,
  }).isRequired,

  login: PropTypes.func.isRequired,
};

export default connect(null, authActions)(LoginScreen);
