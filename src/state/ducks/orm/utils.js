import _ from 'lodash';
import pluralize, { singular } from 'pluralize';

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.substr(1);
}

export function uncapitalize(str) {
  return str.charAt(0).toLowerCase() + str.substr(1);
}

export function getModelName(type) {
  return capitalize(singular(type));
}

export function getCollectionName(type) {
  return uncapitalize(pluralize(type));
}


// contentful-specific utility functions follow

export function getContentType(entry) {
  return entry.sys.contentType.sys.id;
}

export function isRelationship(field) {
  // XXX: this will break for several field types, but
  // none of them are in our current content model.
  // See https://www.contentful.com/developers/docs/concepts/data-model/
  // for field types and details.
  return _.isArray(field) || _.isObject(field);
}

export function getFields(entry) {
  return _.pickBy(entry.fields, field => !isRelationship(field));
}

export function getRelationships(entry) {
  return _.pickBy(entry.fields, isRelationship);
}
