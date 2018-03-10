export function formatMinutesString(momentObj) {
  const minutes = momentObj.asMinutes();
  const suffix = minutes === 1 ? '' : 's';
  return `${minutes} minute${suffix}`;
}
