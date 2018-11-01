import React, { Component } from 'react';
import { ScrollView, Text, TouchableWithoutFeedback } from 'react-native';
import _ from 'lodash';
import { storiesOf } from '@storybook/react-native';

import MeditationSeriesList from '../../src/components/MeditationSeriesList';

const imageUrl = 'https://static1.squarespace.com/static/52fd5845e4b074ebcf586e7b/t/5a6b935be4966b484105c9d3/1516999519606/Centering+Prayer+Cover+Art.jpeg?format=500w';
const stubMeditations = count => _.times(count).map(() => ({}));

const meditationCategories = [
  {
    title: 'All Meditations',
    meditations: stubMeditations(66),
    imageUrl,
  },
  {
    title: 'Oneness',
    meditations: stubMeditations(34),
    imageUrl,
  },
  {
    title: 'Centering Prayer',
    meditations: stubMeditations(1),
    imageUrl,
  },
  {
    title: 'Worship',
    meditations: stubMeditations(10),
    imageUrl,
  },
  {
    title: 'Group meditations',
    meditations: stubMeditations(5),
    imageUrl,
  },
  {
    title: 'The Littlegists',
    meditations: stubMeditations(14),
    imageUrl,
  },
].slice(1, 2);

class MeditationExampleSeriesList extends Component {
  onPressMeditationCategory(meditationCategory) {
    this.setState({
      selectedMeditationCategory: meditationCategory,
    });
  }

  getSelectedMeditationCategory() {
    return _.get(this.state, 'selectedMeditationCategory.title', 'Select a tile');
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={() => this.onPressMeditationCategory()}>
        <ScrollView>
          <MeditationSeriesList
            meditationCategories={meditationCategories}
            onPressMeditationCategory={mc => this.onPressMeditationCategory(mc)}
          />
          <Text>{this.getSelectedMeditationCategory()}</Text>
        </ScrollView>
      </TouchableWithoutFeedback>
    );
  }
}

storiesOf('Series tiles', module).add('Meditation Categories', () => <MeditationExampleSeriesList />);

