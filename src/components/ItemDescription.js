import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import * as WebBrowser from 'expo-web-browser';

import Remarkable from 'remarkable';
import HTML from '@javanhuang/react-native-render-html';
import { AllHtmlEntities } from 'html-entities';
import isHtml from 'is-html';

import SectionHeader from './SectionHeader';
import appPropTypes from '../propTypes';

const md = new Remarkable('commonmark');
const entities = new AllHtmlEntities();

export function renderDescription(item) {
  const { description } = item;
  if (isHtml(description)) {
    return entities.decode(description);
  }
  return md.render(description);
}

const ItemDescription = ({ item, label }) => {
  const description = renderDescription(item);
  return (
    <View>
      <SectionHeader>{label}</SectionHeader>
      {description
        ? (
          <HTML
            html={description}
            onLinkPress={(evt, href) => WebBrowser.openBrowserAsync(href)}
          />
        ) : null
      }
    </View>
  );
};

ItemDescription.propTypes = {
  item: appPropTypes.mediaItem.isRequired,
  label: PropTypes.string,
};

ItemDescription.defaultProps = {
  label: 'Description',
};

export default ItemDescription;
