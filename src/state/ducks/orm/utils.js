export function getModelName(type) {
  // basic singularization
  const singular = type
    .replace(/ies$/, 'y')
    .replace(/s$/, '');

  // capitalize
  return singular.charAt(0).toUpperCase() + singular.substr(1);
}
