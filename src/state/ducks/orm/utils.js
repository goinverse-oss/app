import pluralize from 'pluralize';

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.substr(1);
}

export function uncapitalize(str) {
  return str.charAt(0).toLowerCase() + str.substr(1);
}

export function getModelName(type) {
  // basic singularization
  const singular = type
    .replace(/ies$/, 'y')
    .replace(/s$/, '');

  return capitalize(singular);
}

export function getCollectionName(type) {
  return uncapitalize(pluralize(type));
}
