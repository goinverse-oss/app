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
 * @param {MeditationCategory} category - model instance, or undefined for 'all'
 */
export const viewMeditationCategory = category =>
  NavigationActions.navigate({
    routeName: 'MeditationsCategory',
    params: { category },
  });

/**
 * Navigate to a meditation screen.
 *
 * @param {Meditation} meditation - model instance
 */
export const viewMeditation = meditation =>
  NavigationActions.navigate({
    routeName: 'SingleMeditation',
    params: { meditation },
  });

export const goBack = () => NavigationActions.back();
