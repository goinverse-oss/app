// https://reactnavigation.org/docs/en/navigating-without-navigation-prop.html

import { CommonActions } from '@react-navigation/native';

let _navigator;

export function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}

export function navigate(name, params) {
  _navigator.dispatch(
    CommonActions.navigate({
      name,
      params,
    }),
  );
}
