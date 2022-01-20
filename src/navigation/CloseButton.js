import React from 'react';
import { StyleSheet } from 'react-native';
import { withNavigation } from '@react-navigation/compat';

import Icon from '@expo/vector-icons/MaterialIcons';
import appPropTypes from '../propTypes';

const styles = StyleSheet.create({
  closeIcon: {
    color: '#cccccc',
    fontSize: 24,
    paddingHorizontal: 10,
  },
});

/**
 * Button that, when pressed, dismisses the current modal screen.
 */
const CloseButton = ({ navigation }) => (
  <Icon
    name="close"
    style={styles.closeIcon}
    onPress={() => navigation.goBack(null)}
  />
);

CloseButton.propTypes = {
  navigation: appPropTypes.navigation.isRequired,
};

export default withNavigation(CloseButton);
