import { NavigationActions } from 'react-navigation';

// Navigate to the main screen, past the login screen.
export const login = () => NavigationActions.navigate({ routeName: 'Main' });

// Navigate back to the login screen.
export const logout = () => NavigationActions.navigate({ routeName: 'Login' });

export const managePatreon = () =>
  NavigationActions.navigate({ routeName: 'Patreon' });
