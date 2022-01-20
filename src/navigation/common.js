import React from 'react';

import MenuButton from './MenuButton';
import { defaultShadowStyle } from '../styles';

/**
 * Return a common config object for navigationOptions.
 *
 * Currently, this consists of:
 * - A button on the left of the header that opens the nav drawer
 *
 * @param {object} drawer - the DrawerLayout object
 * @return {object} the common options
 */
export function getCommonNavigationOptions(drawer) {
  return {
    headerLeft: () => <MenuButton drawer={drawer} />,
    headerStyle: {
      ...defaultShadowStyle,
      borderBottomWidth: 0,
    },
    headerTitleStyle: {
      fontSize: 17,
    },
  };
}
