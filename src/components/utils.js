import { Dimensions } from 'react-native';
import moment from 'moment';

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
  publishedAt,
  elapsed,
  formatDuration: _formatDuration,
  formatPublishedAt: _formatPublishedAt,
}) {
  const separator = ' • ';
  const strings = [];
  const formatDuration = _formatDuration || formatMinutesString;
  const formatPublishedAt = _formatPublishedAt || formatHumanizeFromNow;
  if (duration) {
    const durationStr = formatDuration(duration, moment.duration(elapsed));
    if (durationStr) {
      strings.push(durationStr);
    }
  }
  if (publishedAt) {
    const publishedAtStr = formatPublishedAt(publishedAt);
    if (publishedAtStr) {
      strings.push(publishedAtStr);
    }
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
