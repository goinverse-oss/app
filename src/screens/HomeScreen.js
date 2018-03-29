import React from 'react';
import { Text, View } from 'react-native';

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

HomeScreen.navigationOptions = ({ screenProps }) => ({
  ...getCommonNavigationOptions(screenProps.drawer),
  title: 'Home',
});

export default HomeScreen;
