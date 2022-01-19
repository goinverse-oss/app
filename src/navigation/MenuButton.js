import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import Icon from '@expo/vector-icons/MaterialIcons';

const styles = StyleSheet.create({
  menuIcon: {
    fontSize: 24,
    paddingHorizontal: 20,
  },
});

/**
 * Button that, when pressed, opens the navigation drawer.
 */
const MenuButton = () => {
  const navigation = useNavigation();
  return (
    <Icon
      name="menu"
      accessibilityLabel="Menu button"
      accessibilityHint="Opens the sidebar menu"
      style={styles.menuIcon}
      onPress={() => navigation.openDrawer()}
    />
  );
};

MenuButton.propTypes = {
  drawer: PropTypes.shape({}),
};

MenuButton.defaultProps = {
  drawer: null,
};

export default MenuButton;
