import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';

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
const MenuButton = ({ drawer }) => (
  <Icon
    name="menu"
    style={styles.menuIcon}
    onPress={() => drawer && drawer.openDrawer()}
  />
);

MenuButton.propTypes = {
  drawer: PropTypes.shape({}),
};

MenuButton.defaultProps = {
  drawer: null,
};

export default MenuButton;
