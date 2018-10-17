import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

import Markdown from 'react-native-markdown-renderer';

import SectionHeader from './SectionHeader';

const ItemDescription = ({ description, label }) => (
  <View>
    <SectionHeader>{label}</SectionHeader>
    <Markdown>{description}</Markdown>
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
