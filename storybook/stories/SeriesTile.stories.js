import React, { Component } from 'react';
import { View, ScrollView, Text, TouchableWithoutFeedback } from 'react-native';
import _ from 'lodash';
import { storiesOf } from '@storybook/react-native';
import moment from 'moment';


import SeriesTile from '../../src/components/SeriesTile';
import PodcastSeriesDescription from '../../src/components/PodcastSeriesDescription';

const tiles = [
  {
    title: 'The Liturgist Podcast',
    episodeCount: 66,
    lastUpdated: '2018-01-19T12:30:18-08:00',
    image: 'https://static1.squarespace.com/static/52fd5845e4b074ebcf586e7b/t/5a6a579e8165f576bbd614c8/1516918687161/The+Liturgists+Podcast+Logo.jpg?format=500w',
  },
  {
    title: 'Conversations',
    episodeCount: 34,
    lastUpdated: '2017-01-03T12:30:18-08:00',
    image: 'https://static1.squarespace.com/static/52fd5845e4b074ebcf586e7b/t/5a6b9399e4966b484105da84/1516999584877/The+Liturgists+Conversations+Cover+Art.001.jpeg?format=500w',
  },
  {
    title: 'The God Series',
    episodeCount: 10,
    lastUpdated: '2018-01-10T12:30:18-08:00',
    image: 'https://static1.squarespace.com/static/52fd5845e4b074ebcf586e7b/t/5a6b942e53450a6bb75b14b1/1516999732948/IMG_0532.jpg?format=500w',
  },
];

class SeriesList extends Component {
  onPressTile(tile) {
    this.setState({
      selectedTile: tile,
    });
  }

  getSelectedTile() {
    return _.get(this.state, 'selectedTile.title', 'Select a tile');
  }

  formatPodcastDescription = (lastUpdated, totalEpisodes) => {
    const momentDate = this.renderPodcastDate(lastUpdated);
    return (
      <PodcastSeriesDescription lastUpdated={momentDate} totalEpisodes={totalEpisodes} />
    );
  };

  renderPodcastDate = date => moment(date);

  render() {
    return (
      <TouchableWithoutFeedback onPress={() => this.onPressTile()}>
        <ScrollView>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'flex-start',
            }}
          >
            {tiles.map(tile => (
              <SeriesTile
                imageSource={{
                  uri:
                    tile.image,
                }}
                key={tile.title}
                title={tile.title}
                onPress={() => this.onPressTile(tile)}
                description={
                  this.formatPodcastDescription(tile.lastUpdated, tile.episodeCount)
                }
              />
            ))}
          </View>
          <View>
            <Text>{this.getSelectedTile()}</Text>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    );
  }
}

storiesOf('Series tiles', module).add('Podcast', () => <SeriesList />);
