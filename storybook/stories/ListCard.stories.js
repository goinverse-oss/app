import React from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import { storiesOf } from '@storybook/react-native';

import ListCard from '../../src/components/ListCard';
import SquareImage from '../../src/components/SquareImage';

const styles = StyleSheet.create({
  card: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const GenericListCards = () => (
  <ScrollView>
    <ListCard style={styles.card}>
      <Text>Here is some content</Text>
    </ListCard>
    <ListCard style={styles.card}>
      <Text>More content</Text>
      <Text>with some more height</Text>
      <Text>many line</Text>
      <Text>such text</Text>
      <Text>wow</Text>
    </ListCard>
    <ListCard style={styles.card}>
      <SquareImage
        source={{
          uri: 'https://static1.squarespace.com/static/52fd5845e4b074ebcf586e7b/t/5a6a579e8165f576bbd614c8/1516918687161/The+Liturgists+Podcast+Logo.jpg?format=750w',
        }}
        width={150}
      />
    </ListCard>
  </ScrollView>
);

storiesOf('List card', module)
  .add('Generic', () => <GenericListCards />)
  .add('Liturgies', () => {})
  .add('Meditations', () => {})
  .add('Podcasts', () => {})
  .add('Search results', () => {});
