import { Dimensions } from 'react-native';
import moment from 'moment';
import _ from 'lodash';

export function formatMinutesString(durationStr, elapsed = moment.duration()) {
  const momentObj = moment.duration(durationStr).subtract(elapsed);
  const minutes = Math.round(momentObj.asMinutes());
  const suffix = minutes === 1 ? '' : 's';
  const remaining = elapsed.asSeconds() > 0 ? ' remaining' : '';
  return `${minutes} minute${suffix}${remaining}`;
}

export function formatHumanizeFromNow(publishedAt) {
  return `${moment(publishedAt).fromNow()}`;
}

export function formatFooter({
  duration,
  elapsed,
  publishedAt,
  formatDuration: _formatDuration,
  formatPublishedAt: _formatPublishedAt,
}) {
  const separator = ' • ';
  const strings = [];
  const formatDuration = _formatDuration || formatMinutesString;
  const formatPublishedAt = _formatPublishedAt || formatHumanizeFromNow;
  if (duration) {
    strings.push(formatDuration(duration, moment.duration(elapsed)));
  }
  if (!_.isUndefined(publishedAt)) {
    strings.push(formatPublishedAt(publishedAt));
  }
  return strings.join(separator);
}

export function screenRelativeWidth(fraction) {
  const { width } = Dimensions.get('window');
  return width * fraction;
}

export function screenRelativeHeight(fraction) {
  const { height } = Dimensions.get('window');
  return height * fraction;
}
