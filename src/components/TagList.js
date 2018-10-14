import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';

import Tag from '../state/models/Tag';
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

const TagList = ({ tags, onTagPress }) => (
  <View>
    <SectionHeader>Tags</SectionHeader>
    <View style={styles.list}>
      {
        tags.map(tag => (
          <TextPill
            key={tag.name}
            style={styles.tag}
            onPress={() => onTagPress(tag)}
          >
            {tag.name}
          </TextPill>
        ))
      }
    </View>
  </View>
);

TagList.propTypes = {
  tags: PropTypes.arrayOf(
    PropTypes.shape(Tag.propTypes),
  ),

  onTagPress: PropTypes.func,
};

TagList.defaultProps = {
  tags: [],
  onTagPress: () => {},
};

export default TagList;
