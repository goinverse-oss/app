import React from 'react';
import { View, StyleSheet } from 'react-native';

import { storiesOf } from '@storybook/react-native';

import TextPill from '../../src/components/TextPill';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  pill: {
    marginHorizontal: 4,
  },
});

storiesOf('Text pills', module)
  .add('in a row', () => (
    <View style={styles.container}>
      <TextPill style={styles.pill}>Here is some text</TextPill>
      <TextPill style={styles.pill}>and</TextPill>
      <TextPill style={styles.pill}>other</TextPill>
      <TextPill style={styles.pill}>words too</TextPill>
    </View>
  ));
