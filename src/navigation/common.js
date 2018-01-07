import React from 'react';

import MenuButton from './MenuButton';
import LogoutButton from './LogoutButton';

export function getCommonNavigationOptions(navigation) {
  return {
    headerLeft: <MenuButton navigation={navigation} />,
    headerRight: <LogoutButton />,
  };
}
