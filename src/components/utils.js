import { Dimensions } from 'react-native';

export function formatMinutesString(momentObj) {
  const minutes = Math.round(momentObj.asMinutes());
  const suffix = minutes === 1 ? '' : 's';
  return `${minutes} minute${suffix}`;
}

export function screenRelativeWidth(fraction) {
  const { width } = Dimensions.get('window');
  return width * fraction;
}

export function screenRelativeHeight(fraction) {
  const { height } = Dimensions.get('window');
  return height * fraction;
}
