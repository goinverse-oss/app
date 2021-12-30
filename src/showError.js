import _ from 'lodash';

let dropdown;

export function setDropdown(d) {
  dropdown = d;
}

export default function showError(error) {
  // eslint-disable-next-line no-console
  console.log(error);

  if (!dropdown) {
    return;
  }

  dropdown.alertWithType(
    'error',
    error.message || 'Error',
    [
      _.get(error, 'config.url', ''),
      _.get(error, 'request._response', ''),
      _.get(error, 'description'),
    ].join('\n'),
  );
}
