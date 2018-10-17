import React, { Component } from 'react';
import { TouchableWithoutFeedback, View, Text } from 'react-native';
import _ from 'lodash';

import { storiesOf } from '@storybook/react-native';

import PersonList from '../../src/components/PersonList';

const people = [
  {
    name: 'Rachel Held Evans',
    imageUrl: 'https://static1.squarespace.com/static/4f63ddf524ac9f2c23f422a4/5046a2eec4aa7e7d99011b46/54d7c403e4b081035491e68b/1423426564356/0.jpeg',
  },
  {
    name: 'Mike McHargue',
    imageUrl: 'https://static1.squarespace.com/static/52fd5845e4b074ebcf586e7b/t/5a6ba9f353450a161ce1ed85/1517005300833/Friday_Web+%2848+of+140%29.jpg?format=750w',
  },
  {
    name: 'Michael Gungor',
    imageUrl: 'https://static1.squarespace.com/static/52fd5845e4b074ebcf586e7b/t/5a6ba93ce4966b17e0a8f736/1517005123872/Friday_Web+%2818+of+140%29.jpg?format=750w',
  },
  {
    name: 'Hillary McBride',
    imageUrl: 'https://static1.squarespace.com/static/52fd5845e4b074ebcf586e7b/t/5a6badbac83025fc416fad0d/1517006272426/IMG_E9818.JPG?format=1000w',
  },
  {
    name: 'William Matthews',
    imageUrl: 'https://static1.squarespace.com/static/52fd5845e4b074ebcf586e7b/t/5a6bae760d9297f24bc5cdb7/1517006456578/IMG_5962.jpg?format=1000w',
  },
];

class PersonCards extends Component {
  onPressPerson(person) {
    this.setState({
      selectedPerson: person,
    });
  }

  getSelectedPersonName() {
    return _.get(this.state, 'selectedPerson.name', 'Select a person');
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={() => this.onPressPerson()}>
        <View style={{ paddingLeft: 10, height: '100%' }}>
          <PersonList
            people={people}
            onPressPerson={person => this.onPressPerson(person)}
          />
          <Text>{this.getSelectedPersonName()}</Text>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

storiesOf('Person list', module)
  .add('with people', () => <PersonCards />);
