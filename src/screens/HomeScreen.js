import React from 'react';
import PropTypes from 'prop-types';
import { Text, View } from 'react-native';
import Icon from '@expo/vector-icons/Ionicons';

import { getCommonNavigationOptions } from '../navigation/common';
import styles from '../styles';

/**
 * Landing screen for logged-in users, containing a preview
 * of the other stuff you can get to via the tabs.
 */
const HomeScreen = () => (
  <View style={styles.container}>
    <Text>
      Placeholder home screen
    </Text>
  </View>
);

const HomeIcon = ({ tintColor }) => (
  <Icon
    name="md-home"
    style={{
      color: tintColor,
      fontSize: 32,
    }}
  />
);

HomeIcon.propTypes = {
  tintColor: PropTypes.string.isRequired,
};

HomeScreen.navigationOptions = ({ screenProps }) => ({
  ...getCommonNavigationOptions(screenProps.drawer),
  title: 'Home',
  tabBarIcon: HomeIcon,
});

export default HomeScreen;
