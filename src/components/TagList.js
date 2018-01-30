import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import _ from 'lodash';

import SectionHeader from './SectionHeader';
import TextPill from './TextPill';

const styles = StyleSheet.create({
  list: {
    flexDirection: 'row',
    marginVertical: 8,
    flexWrap: 'wrap',
  },
  tag: {
    marginHorizontal: 3,
    marginVertical: 3,
  },
});

function getTagText(tag) {
  if (_.isString(tag)) {
    return tag;
  }

  return tag.label || tag.value;
}

const TagList = ({ tags, onTagPress }) => (
  <View>
    <SectionHeader>Tags</SectionHeader>
    <View style={styles.list}>
      {
        tags.map(tag => (
          <TextPill
            key={getTagText(tag)}
            style={styles.tag}
            onPress={() => onTagPress(tag)}
          >
            {getTagText(tag)}
          </TextPill>
        ))
      }
    </View>
  </View>
);

const tagPropType = PropTypes.oneOfType([
  PropTypes.string.isRequired,
  PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string,
  }),
]);

TagList.propTypes = {
  tags: PropTypes.oneOfType([
    tagPropType,
    PropTypes.arrayOf(tagPropType),
  ]).isRequired,

  onTagPress: PropTypes.func,
};

TagList.defaultProps = {
  onTagPress: () => {},
};

export default TagList;
