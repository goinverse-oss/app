import React from 'react';
import PropTypes from 'prop-types';
import { Text } from 'react-native';

const MenuButton = ({ navigation }) => (
  <Text onPress={() => navigation.navigate('DrawerOpen')}>
    Menu
  </Text>
);

MenuButton.propTypes = {
  navigation: PropTypes.shape({
    dispatch: PropTypes.func.isRequired,
  }).isRequired,
};

export default MenuButton;
