import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { WebBrowser } from 'expo';

import Remarkable from 'remarkable';
import HTML from 'react-native-render-html';
import { AllHtmlEntities } from 'html-entities';
import isHtml from 'is-html';

import SectionHeader from './SectionHeader';

const md = new Remarkable('commonmark');
const entities = new AllHtmlEntities();

export function renderDescription(description) {
  if (isHtml(description)) {
    return entities.decode(description);
  }
  return md.render(description);
}

const ItemDescription = ({ description, label }) => (
  <View>
    <SectionHeader>{label}</SectionHeader>
    <HTML
      html={renderDescription(description)}
      onLinkPress={(evt, href) => WebBrowser.openBrowserAsync(href)}
    />
  </View>
);

ItemDescription.propTypes = {
  description: PropTypes.string.isRequired,
  label: PropTypes.string,
};

ItemDescription.defaultProps = {
  label: 'Description',
};

export default ItemDescription;
