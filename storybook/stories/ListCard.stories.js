import React, { Component } from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import { storiesOf } from '@storybook/react-native';
import moment from 'moment';

import ListCard from '../../src/components/ListCard';
import SquareImage from '../../src/components/SquareImage';
import PlayableListCard from '../../src/components/PlayableListCard';

const styles = StyleSheet.create({
  card: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

class GenericListCards extends Component {
  constructor() {
    super();
    this.state = {
      selectedCard: null,
    };
  }

  getStyle(index) {
    return [
      {
        backgroundColor: (
          (index === this.state.selectedCard)
            ? 'yellow'
            : 'white'
        ),
      },
    ];
  }

  getCenteredStyle(index) {
    return [styles.card, ...this.getStyle(index)];
  }

  getOnPress(index) {
    return () => {
      this.setState({ selectedCard: index });
      setTimeout(() => this.setState({ selectedCard: null }), 500);
    };
  }

  render() {
    return (
      <ScrollView>
        <ListCard style={this.getCenteredStyle(0)} onPress={this.getOnPress(0)}>
          <Text>Here is some content</Text>
        </ListCard>
        <ListCard style={this.getCenteredStyle(1)} onPress={this.getOnPress(1)}>
          <Text>More content</Text>
          <Text>with some more height</Text>
          <Text>many line</Text>
          <Text>such text</Text>
          <Text>wow</Text>
        </ListCard>
        <ListCard style={this.getCenteredStyle(2)} onPress={this.getOnPress(2)}>
          <SquareImage
            source={{
              uri: 'https://static1.squarespace.com/static/52fd5845e4b074ebcf586e7b/t/5a6a579e8165f576bbd614c8/1516918687161/The+Liturgists+Podcast+Logo.jpg?format=750w',
            }}
            width={150}
          />
        </ListCard>
      </ScrollView>
    );
  }
}

const PlayableListCardStory = props => (
  <PlayableListCard
    coverImageSource={{
      uri: 'https://static1.squarespace.com/static/52fd5845e4b074ebcf586e7b/t/5a6a579e8165f576bbd614c8/1516918687161/The+Liturgists+Podcast+Logo.jpg?format=750w',
    }}
    title="Enemies - Live from Los Angeles"
    description="This is a special live episode recorded at The Liturgists Gathering in Los Angeles, CA on September 15, 2017."
    duration={moment.duration(88, 'minutes')}
    publishDate={moment('2017-09-15')}
    {...props}
  />
);

storiesOf('List card', module)
  .add('Generic', () => <GenericListCards />)
  .add('Playable', () => <PlayableListCardStory />)
  .add('Liturgies', () => {})
  .add('Meditations', () => {})
  .add('Podcasts', () => {})
  .add('Search results', () => (
    <ScrollView>
      <PlayableListCardStory isSearchResult />
    </ScrollView>
  ));
