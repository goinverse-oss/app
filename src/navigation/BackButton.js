import React from 'react';
import { StyleSheet } from 'react-native';
import { withNavigation } from '@react-navigation/compat';

import Icon from '@expo/vector-icons/Ionicons';
import appPropTypes from '../propTypes';

const styles = StyleSheet.create({
  backIcon: {
    fontSize: 36,
    paddingHorizontal: 20,
  },
});

/**
 * Button that, when pressed, opens the navigation drawer.
 */
const BackButton = ({ navigation }) => (
  <Icon
    name="ios-arrow-round-back"
    style={styles.backIcon}
    onPress={() => navigation.goBack()}
  />
);

BackButton.propTypes = {
  navigation: appPropTypes.navigation.isRequired,
};

export default withNavigation(BackButton);
