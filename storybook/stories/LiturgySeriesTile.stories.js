import React, { Component } from 'react';
import { ScrollView, Text, TouchableWithoutFeedback } from 'react-native';
import _ from 'lodash';
import moment from 'moment';
import { storiesOf } from '@storybook/react-native';

import LiturgySeriesList from '../../src/components/LiturgySeriesList';

const liturgies = [
  {
    title: 'Oh Light',
    liturgyLength: 50,
    publishedDate: moment('2015-01-19T12:30:18-08:00'),
  },
  {
    title: 'Garden',
    liturgyLength: 34,
    publishedDate: moment('2017-01-03T12:30:18-08:00'),
  },
  {
    title: 'Pentecost',
    liturgyLength: 50,
    publishedDate: moment('2015-01-10T12:30:18-08:00'),
  },
  {
    title: 'God Our Mother',
    liturgyLength: 25,
    publishedDate: moment('2015-01-10T12:30:18-08:00'),
  },
  {
    title: 'Vapor',
    liturgyLength: 25,
    publishedDate: moment('2015-01-10T12:30:18-08:00'),
  },
].map((liturgy, i) => ({
  ...liturgy,
  imageUrl: `https://loremflickr.com/300/300?random=${i}`,
}));

class LiturgyExampleSeriesList extends Component {
  onPressLiturgy(liturgy) {
    this.setState({
      selectedLiturgy: liturgy,
    });
  }

  getSelectedLiturgy() {
    return _.get(this.state, 'selectedLiturgy.title', 'Select a tile');
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={() => this.onPressLiturgy()}>
        <ScrollView>
          <LiturgySeriesList
            liturgies={liturgies}
            onPressLiturgy={liturgy => this.onPressLiturgy(liturgy)}
          />
          <Text>{this.getSelectedLiturgy()}</Text>
        </ScrollView>
      </TouchableWithoutFeedback>
    );
  }
}

storiesOf('Series tiles', module).add('Liturgies', () => <LiturgyExampleSeriesList />);

