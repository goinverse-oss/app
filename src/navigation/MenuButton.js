import React from 'react';
import PropTypes from 'prop-types';
import { Text } from 'react-native';

/**
 * Button that, when pressed, opens the navigation drawer.
 */
const MenuButton = ({ navigation }) => (
  <Text onPress={() => navigation.navigate('DrawerOpen')}>
    Menu
  </Text>
);

MenuButton.propTypes = {
  // react-navigation nav object
  // NOTE: I'm not sure why it doesn't work to just use
  // redux `dispatch(NavigationActions('DrawerOpen'))`,
  // but it didn't work when I tried it.
  navigation: PropTypes.shape({
    dispatch: PropTypes.func.isRequired,
  }).isRequired,
};

export default MenuButton;
