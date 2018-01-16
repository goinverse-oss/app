import React from 'react';
import { Text, View } from 'react-native';

import { getCommonNavigationOptions } from '../navigation/common';
import styles from '../styles';

const HomeScreen = () => (
  <View style={styles.container}>
    <Text>
      Placeholder home screen
    </Text>
  </View>
);

HomeScreen.navigationOptions = ({ navigation }) => ({
  ...getCommonNavigationOptions(navigation),
  title: 'Home',
});

export default HomeScreen;
