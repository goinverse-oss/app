import _ from 'lodash';
import pluralize, { singular } from 'pluralize';

import placeholderImage from '../../../../assets/footer.png';

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

export function getImageSource(item, large = false) {
  const imageKey = large ? 'largeImage' : 'image';
  const imageUrlKey = `${imageKey}Url`;
  const itemImageUrl = item[imageKey] || item[imageUrlKey];
  if (itemImageUrl) {
    return imageSource(itemImageUrl);
  }

  let collection;
  if (item.type === 'meditation') {
    collection = item.category;
  } else if (item.type === 'podcastEpisode') {
    collection = item.podcast;
  } else if (item.type === 'liturgyItem') {
    collection = item.liturgy;
  }

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
