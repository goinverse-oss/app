import React, { Component } from 'react';
import { TouchableWithoutFeedback, View, Text } from 'react-native';
import _ from 'lodash';

import { storiesOf } from '@storybook/react-native';

import PersonCard from '../../src/components/PersonCard';

const people = [
  {
    name: 'Rachel Held Evans',
    imageSource: {
      uri: 'https://static1.squarespace.com/static/4f63ddf524ac9f2c23f422a4/5046a2eec4aa7e7d99011b46/54d7c403e4b081035491e68b/1423426564356/0.jpeg',
    },
  },
  {
    name: 'Mike McHargue',
    imageSource: {
      uri: 'https://static1.squarespace.com/static/52fd5845e4b074ebcf586e7b/t/5a6ba9f353450a161ce1ed85/1517005300833/Friday_Web+%2848+of+140%29.jpg?format=750w',
    },
  },
  {
    name: 'Michael Gungor',
    imageSource: {
      uri: 'https://static1.squarespace.com/static/52fd5845e4b074ebcf586e7b/t/5a6ba93ce4966b17e0a8f736/1517005123872/Friday_Web+%2818+of+140%29.jpg?format=750w',
    },
  },
];

class PersonCards extends Component {
  onPressPerson(person) {
    this.setState({
      selectedPerson: person,
    });
  }

  getCardStyle(person) {
    return {
      marginHorizontal: 5,
      backgroundColor: (
        person.name === _.get(this.state, 'selectedPerson.name')
          ? 'yellow'
          : 'white'
      ),
    };
  }

  getSelectedPersonName() {
    return _.get(this.state, 'selectedPerson.name', 'Select a person');
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={() => this.onPressPerson()}>
        <View style={{ paddingLeft: 10, height: '100%' }}>
          <View style={{ flexDirection: 'row' }}>
            {people.map(person => (
              <PersonCard
                key={person.name}
                person={person}
                onPress={() => this.onPressPerson(person)}
                style={this.getCardStyle(person)}
              />
            ))}
          </View>
          <Text>{this.getSelectedPersonName()}</Text>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

storiesOf('Person cards', module)
  .add('with people', () => <PersonCards />);
