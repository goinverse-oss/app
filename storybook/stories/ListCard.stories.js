import React, { Component } from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import { storiesOf } from '@storybook/react-native';
import moment from 'moment';

import ListCard from '../../src/components/ListCard';
import SquareImage from '../../src/components/SquareImage';
import PlayableListCard from '../../src/components/PlayableListCard';
import PodcastEpisodeListCard from '../../src/components/PodcastEpisodeListCard';
import LiturgyItemListCard from '../../src/components/LiturgyItemListCard';

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

const liturgistsPodcastImageUrl = 'https://static1.squarespace.com/static/52fd5845e4b074ebcf586e7b/t/5a6a579e8165f576bbd614c8/1516918687161/The+Liturgists+Podcast+Logo.jpg?format=750w';

const podcasts = [
  {
    imageUrl: liturgistsPodcastImageUrl,
    title: 'Enemies - Live from Los Angeles',
    description: (
      'This is a special live episode recorded at The Liturgists Gathering ' +
      'in Los Angeles, CA on September 15, 2017.'
    ),
    duration: moment.duration(88, 'minutes'),
    publishDate: moment('2017-09-15'),
  },
  {
    imageUrl: liturgistsPodcastImageUrl,
    title: 'Names',
    description: (
      'An exploration of what names are, how they shape us, and what happens ' +
      'when we change more than our label can accommodate.'
    ),
    duration: moment.duration(70, 'minutes'),
    publishDate: moment('2017-08-14'),
  },
  {
    imageUrl: liturgistsPodcastImageUrl,
    title: 'Rob Bell and the Bible',
    description: (
      'Science Mike and Michael Gungor talk to Rob Bell about his latest book, ' +
      'What is the Bible.'
    ),
    duration: moment.duration(77, 'minutes'),
    publishDate: moment('2017-07-10'),
  },
];

const gardenLiturgyImageUrl = 'https://f4.bcbits.com/img/a4076498522_16.jpg';

const liturgies = [
  {
    imageUrl: gardenLiturgyImageUrl,
    title: '1. Friday',
    description: 'Amena Brown',
    duration: moment.duration(1, 'minutes'),
  },
  {
    imageUrl: gardenLiturgyImageUrl,
    title: '2. Teresa',
    description: 'Michael Gungor',
    duration: moment.duration(4, 'minutes'),
  },
  {
    imageUrl: gardenLiturgyImageUrl,
    title: '3. Saturday',
    description: 'Rachel Held Evans',
    duration: moment.duration(4, 'minutes'),
  },
];

storiesOf('List card', module)
  .add('Generic', () => <GenericListCards />)
  .add('Playable', () => <PlayableListCardStory />)
  .add('Liturgies', () => (
    <ScrollView>
      {liturgies.map(liturgy => (
        <LiturgyItemListCard key={liturgy.title} liturgyItem={liturgy} />
      ))}
    </ScrollView>
  ))
  .add('Meditations', () => {})
  .add('Podcasts', () => (
    <ScrollView>
      {podcasts.map(podcast => (
        <PodcastEpisodeListCard key={podcast.title} podcastEpisode={podcast} />
      ))}
    </ScrollView>
  ))
  .add('Search results', () => (
    <ScrollView>
      <PlayableListCardStory isSearchResult />
    </ScrollView>
  ));
