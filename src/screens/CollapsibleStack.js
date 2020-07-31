import React, { useState } from 'react';
import PropTypes from 'prop-types';

import {
  View,
  StyleSheet,
} from 'react-native';

import CommunityItem from './CommunityItem';
import { screenRelativeWidth } from '../components/utils';

const styles = StyleSheet.create({
  section: {
    marginVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
    width: screenRelativeWidth(0.8),
  },
});

const CollapsibleStack = ({
  items, index, setIndex, baseIndex,
}) => {
  const [selectedIndex, setSelectedIndex] = setIndex ? [index, setIndex] : useState(null);

  function setOrClearIndex(idx) {
    if (idx === selectedIndex) {
      setSelectedIndex(null);
    } else {
      setSelectedIndex(idx);
    }
  }

  return (
    <View style={styles.section}>
      {
        items.map(
          (item, i) => (
            <CommunityItem
              key={item.title}
              selected={selectedIndex === i + baseIndex}
              onSelect={() => setOrClearIndex(i + baseIndex)}
              {...item}
            />
          ),
        )
      }
    </View>
  );
};

CollapsibleStack.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({})),
  index: PropTypes.number,
  setIndex: PropTypes.func,
  baseIndex: PropTypes.number,
};

CollapsibleStack.defaultProps = {
  items: [],
  index: null,
  setIndex: null,
  baseIndex: 0,
};

export default CollapsibleStack;
