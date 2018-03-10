import React, { Component } from 'react';
import { ScrollView, Text, TouchableWithoutFeedback } from 'react-native';
import _ from 'lodash';
import { storiesOf } from '@storybook/react-native';

import MeditationSeriesList from '../../src/components/MeditationSeriesList';

const meditations = [
  {
    title: 'All Meditations',
    meditationCount: 66,
    imageSource: {
      uri: 'https://static1.squarespace.com/static/52fd5845e4b074ebcf586e7b/t/5a6b935be4966b484105c9d3/1516999519606/Centering+Prayer+Cover+Art.jpeg?format=500w',
    },
  },
  {
    title: 'Oneness',
    meditationCount: 34,
    imageSource: {
      uri: 'https://static1.squarespace.com/static/52fd5845e4b074ebcf586e7b/t/5a6b935be4966b484105c9d3/1516999519606/Centering+Prayer+Cover+Art.jpeg?format=500w',
    },
  },
  {
    title: 'Centering Prayer',
    meditationCount: 1,
    imageSource: {
      uri: 'https://static1.squarespace.com/static/52fd5845e4b074ebcf586e7b/t/5a6b935be4966b484105c9d3/1516999519606/Centering+Prayer+Cover+Art.jpeg?format=500w',
    },
  },
  {
    title: 'Worship',
    meditationCount: 10,
    imageSource: {
      uri: 'https://static1.squarespace.com/static/52fd5845e4b074ebcf586e7b/t/5a6b935be4966b484105c9d3/1516999519606/Centering+Prayer+Cover+Art.jpeg?format=500w',
    },
  },
  {
    title: 'Group meditations',
    meditationCount: 5,
    imageSource: {
      uri: 'https://static1.squarespace.com/static/52fd5845e4b074ebcf586e7b/t/5a6b935be4966b484105c9d3/1516999519606/Centering+Prayer+Cover+Art.jpeg?format=500w',
    },
  },
  {
    title: 'The Littlegists',
    meditationCount: 14,
    imageSource: {
      uri: 'https://static1.squarespace.com/static/52fd5845e4b074ebcf586e7b/t/5a6b935be4966b484105c9d3/1516999519606/Centering+Prayer+Cover+Art.jpeg?format=500w',
    },
  },
];

class MeditationExampleSeriesList extends Component {
  onPressMeditation(meditation) {
    this.setState({
      selectedMeditation: meditation,
    });
  }

  getSelectedMeditation() {
    return _.get(this.state, 'selectedMeditation.title', 'Select a tile');
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={() => this.onPressMeditation()}>
        <ScrollView>
          <MeditationSeriesList
            meditations={meditations}
            onPressMeditation={meditation => this.onPressMeditation(meditation)}
          />
          <Text>{this.getSelectedMeditation()}</Text>
        </ScrollView>
      </TouchableWithoutFeedback>
    );
  }
}

storiesOf('Series tiles', module).add('Meditations', () => <MeditationExampleSeriesList />);

