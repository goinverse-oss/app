import React from 'react';

import MenuButton from './MenuButton';
import LogoutButton from './LogoutButton';

/**
 * Return a common config object for navigationOptions.
 *
 * Currently, this consists of:
 * - A button on the left of the header that opens the nav drawer
 * - A button on the right that logs the user out
 *
 * @param {object} navigation - react-navigation nav object
 * @return {object} the common options
 */
export function getCommonNavigationOptions(navigation) {
  return {
    headerLeft: <MenuButton navigation={navigation} />,
    headerRight: <LogoutButton />,
  };
}
