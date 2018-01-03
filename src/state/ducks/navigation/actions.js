import { NavigationActions } from 'react-navigation';

export const login = () => NavigationActions.navigate({ routeName: 'Main' });
export const logout = () => NavigationActions.navigate({ routeName: 'Login' });
