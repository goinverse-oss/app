import { NavigationActions } from 'react-navigation';

// Navigate to the main screen, past the login screen.
export const login = () => NavigationActions.navigate({ routeName: 'Main' });

// Navigate back to the login screen.
export const logout = () => NavigationActions.navigate({ routeName: 'Login' });

export const managePatreon = () =>
  NavigationActions.navigate({ routeName: 'Patreon' });

/**
 * Navigate to a meditation category screen.
 *
 * @param {string} category - the id of the category, or undefined for 'all'
 */
export const viewMeditation = category =>
  NavigationActions.navigate({
    routeName: 'MeditationsCategory',
    params: { category },
  });

export const goBack = () => NavigationActions.back();
