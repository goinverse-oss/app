import _ from 'lodash';
import pluralize, { singular } from 'pluralize';

import placeholderImage from '../../../../assets/placeholder.png';

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

export function getGroupField(item) {
  return ['category', 'podcast', 'liturgy'].find(g => _.has(item, g));
}

export function getSeriesTitle(item) {
  const group = getGroupField(item);
  return _.get(item, [group, 'title']);
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
  return _.isArray(field) || (
    _.isObject(field) && _.get(field, 'sys.type') !== 'Asset'
  );
}

function isAsset(field) {
  return _.get(field, 'sys.type') === 'Asset';
}

export function getFields(entry) {
  return _.pickBy(entry.fields, field => (
    !isRelationship(field) &&
    !isAsset(field)
  ));
}

export function getRelationships(entry) {
  return _.pickBy(entry.fields, isRelationship);
}

function getAsset(field) {
  const url = _.get(field, 'fields.file.url');
  return url ? `https:${url}` : null;
}

export function getAssets(entry) {
  const assetFields = _.pickBy(entry.fields, isAsset);
  const assets = _.mapValues(assetFields, getAsset);
  return assets;
}

function imageSource(uri) {
  return { uri };
}

export function getCollection(item) {
  if (item.type === 'meditation') {
    return item.category;
  } else if (item.type === 'podcastEpisode') {
    return item.podcast;
  } else if (item.type === 'liturgyItem') {
    return item.liturgy;
  }
  return null;
}

export function getImageSource(item, large = false) {
  const imageKey = large ? 'largeImage' : 'image';
  const imageUrlKey = `${imageKey}Url`;
  const itemImageUrl = item[imageKey] || item[imageUrlKey];
  if (itemImageUrl) {
    return imageSource(itemImageUrl);
  }

  const collection = getCollection(item);

  if (!collection) {
    return placeholderImage;
  }

  const collectionImageUrl = collection[imageKey] || collection[imageUrlKey];
  return collectionImageUrl ? imageSource(collectionImageUrl) : placeholderImage;
}

export function getMediaSource(item) {
  const uri = item.media || item.mediaUrl;
  if (uri) {
    return { uri };
  }
  return undefined;
}

export function getPublishedAt(item) {
  if (item.type === 'liturgyItem') {
    return item.liturgy.publishedAt;
  }

  return item.publishedAt;
}
