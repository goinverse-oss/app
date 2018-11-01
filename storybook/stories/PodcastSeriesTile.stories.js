import React, { Component } from 'react';
import { ScrollView, Text, TouchableWithoutFeedback } from 'react-native';
import _ from 'lodash';
import moment from 'moment';
import { storiesOf } from '@storybook/react-native';

import PodcastSeriesList from '../../src/components/PodcastSeriesList';

const podcasts = [
  {
    title: 'The Liturgists Podcast',
    episodeCount: 66,
    lastUpdated: moment('2018-01-19T12:30:18-08:00'),
    imageUrl: 'https://static1.squarespace.com/static/52fd5845e4b074ebcf586e7b/t/5a6a579e8165f576bbd614c8/1516918687161/The+Liturgists+Podcast+Logo.jpg?format=500w',
  },
  {
    title: 'Conversations',
    episodeCount: 34,
    lastUpdated: moment('2017-01-03T12:30:18-08:00'),
    imageUrl: 'https://loremflickr.com/300/300',
  },
  {
    title: 'The God Series',
    episodeCount: 1,
    lastUpdated: moment('2018-01-10T12:30:18-08:00'),
    imageUrl: 'https://static1.squarespace.com/static/52fd5845e4b074ebcf586e7b/t/5a6b942e53450a6bb75b14b1/1516999732948/IMG_0532.jpg?format=500w',
  },
];

class PodcastExampleSeriesList extends Component {
  onPressPodcast(podcast) {
    this.setState({
      selectedPodcast: podcast,
    });
  }

  getSelectedPodcast() {
    return _.get(this.state, 'selectedPodcast.title', 'Select a tile');
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={() => this.onPressPodcast()}>
        <ScrollView>
          <PodcastSeriesList
            podcasts={podcasts}
            onPressPodcast={podcast => this.onPressPodcast(podcast)}
          />
          <Text>{this.getSelectedPodcast()}</Text>
        </ScrollView>
      </TouchableWithoutFeedback>
    );
  }
}

storiesOf('Series tiles', module).add('Podcasts', () => <PodcastExampleSeriesList />);

