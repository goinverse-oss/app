import React, { Component } from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import { storiesOf } from '@storybook/react-native';
import moment from 'moment';

import ListCard from '../../src/components/ListCard';
import SquareImage from '../../src/components/SquareImage';
import PlayableListCard from '../../src/components/PlayableListCard';
import PodcastEpisodeListCard from '../../src/components/PodcastEpisodeListCard';
import LiturgyItemListCard from '../../src/components/LiturgyItemListCard';
import MeditationListCard from '../../src/components/MeditationListCard';
import EventListCard from '../../src/components/EventListCard';

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
    publishedAt={moment('2017-09-15')}
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
    publishedAt: moment('2017-09-15'),
  },
  {
    imageUrl: liturgistsPodcastImageUrl,
    title: 'Names',
    description: (
      'An exploration of what names are, how they shape us, and what happens ' +
      'when we change more than our label can accommodate.'
    ),
    duration: moment.duration(70, 'minutes'),
    publishedAt: moment('2017-08-14'),
  },
  {
    imageUrl: liturgistsPodcastImageUrl,
    title: 'Rob Bell and the Bible',
    description: (
      'Science Mike and Michael Gungor talk to Rob Bell about his latest book, ' +
      'What is the Bible.'
    ),
    duration: moment.duration(77, 'minutes'),
    publishedAt: moment('2017-07-10'),
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

const meditations = [
  {
    imageUrl: 'https://c10.patreonusercontent.com/3/eyJ3Ijo2MjAsIngiOjI0OTM3OTh9/patreon-posts/WkED08RyoZXTLW3fAdor61q_g4p_3xkoKYHM2_FX4mG5VDmm9EHq3tMzZfXufJLE.jpg?token-time=1520121600&token-hash=5q0qh-mUJDWF7a9CaCq3V8PbPb-qRai-O0iUVYIBa7w%3D',
    title: 'Letting Go',
    description: 'A meditation by Hillary McBride.',
    duration: moment.duration(12, 'minutes'),
    publishedAt: moment('2018-02-16T19:38:00-05:00'),
  },
  {
    imageUrl: 'https://c10.patreonusercontent.com/3/eyJ3Ijo2MjAsIngiOjI0OTM3OTh9/patreon-posts/6dxl-4tk3GKZ21CBz9pWlE0B81vVMFzRUZD1gLziorG8EpQhqfCbOdd-gp4FAxuu.jpeg?token-time=1520121600&token-hash=dDNuIFl4rHNvvT9T01ZExdteHSQhpCtnFo-nJt7S1zI%3D',
    title: 'Who are you',
    description: (
      'A contemplative deconstruction of who you think you are. ' +
      'Every musical sound you hear in this meditation is from a single cymbal, ' +
      'representing the underlying unity of all.'
    ),
    duration: moment.duration(9, 'minutes'),
    publishedAt: moment('2018-02-01T19:37:00-05:00'),
  },
  {
    imageUrl: 'https://c10.patreonusercontent.com/3/eyJ3Ijo2MjAsIngiOjI0OTM3OTh9/patreon-posts/J_mDFznRg3WJmwlz-co6c6NqQW0EUuYQOXOgdDMn8dFos2bjJ9AVAW8l-9UxLEUD.png?token-time=1520121600&token-hash=GAwP4Q6h56q15DS12uy406y8V87izp5lzs0XMPlSEsI%3D',
    title: 'Loving Kindness Meditation',
    description: (
      'An open heart is a healing heart. This is a meditation that will ' +
      'become more powerful and helpful with repetition.'
    ),
    duration: moment.duration(22, 'minutes'),
    publishedAt: moment('2018-01-22T16:45:00-05:00'),
  },
];

const events = [
  {
    title: 'The Liturgists Gathering',
    start: moment('2017-10-27'),
    end: moment('2017-10-28'),
    location: 'Seattle, WA',
    timezone: 'America/Los_Angeles',
    description: (
      'A place where the unlikely gather around a table and find a place to belong. ' +
      'A safe place to have honest discussions about doubts, hopes, fears... and faith.'
    ),
  },
  {
    title: 'Ripple Effect Conference',
    start: moment('2017-11-25'),
    location: 'Lawrence, MA',
    timezone: 'America/New_York',
    description: (
      'Ripple Effect is designed to provide resources that will inspire and ' +
      'equip you and your leaders to live more fully into the mission of the ' +
      'church. The planning team is at work now to provide a high-quality event ' +
      'that includes...'
    ),
  },
  {
    title: 'Ask Science Mike LIVE',
    start: moment('2018-02-07T18:00:00-08:00'),
    location: 'Orange, CA',
    timezone: 'America/Los_Angeles',
    description: (
      'Live at Chapman University, Science Mike will be taking questions and ' +
      'giving answers right then and there. Ask Science Mike LIVE events are ' +
      'always a lot of fun and...'
    ),
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
  .add('Meditations', () => (
    <ScrollView>
      {meditations.map(meditation => (
        <MeditationListCard key={meditation.title} meditation={meditation} />
      ))}
    </ScrollView>
  ))
  .add('Podcasts', () => (
    <ScrollView>
      {podcasts.map(podcast => (
        <PodcastEpisodeListCard key={podcast.title} podcastEpisode={podcast} />
      ))}
    </ScrollView>
  ))
  .add('Events', () => (
    <ScrollView>
      {events.map(event => (
        <EventListCard key={`${event.title}-${event.start}`} event={event} />
      ))}
    </ScrollView>
  ))
  .add('Search results', () => (
    <ScrollView>
      <LiturgyItemListCard liturgyItem={liturgies[0]} isSearchResult />
      <PodcastEpisodeListCard podcastEpisode={podcasts[0]} isSearchResult />
      <MeditationListCard meditation={meditations[0]} isSearchResult />
      <EventListCard event={events[0]} isSearchResult />
    </ScrollView>
  ));
