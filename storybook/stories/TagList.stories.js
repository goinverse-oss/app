import React, { Component } from 'react';
import { View, Text } from 'react-native';

import { storiesOf } from '@storybook/react-native';

import TagList from '../../src/components/TagList';

class InteractiveTagList extends Component {
  constructor() {
    super();
    this.state = {
      pressedTag: null,
    };
    this.onTagPress = this.onTagPress.bind(this);
  }

  onTagPress(tag) {
    this.setState({ pressedTag: tag });
  }

  getpressedTag() {
    if (this.state.pressedTag) {
      return `Pressed tag: ${this.state.pressedTag}`;
    }

    return 'Press a tag';
  }

  render() {
    const tags = ['one', 'two', 'three', 'four'];
    return (
      <View>
        <TagList tags={tags} onTagPress={this.onTagPress} />
        <Text>{this.getpressedTag()}</Text>
      </View>
    );
  }
}

storiesOf('Tag list', module)
  .add('without wrapping', () => (
    <TagList tags={['one', 'two', 'three']} />
  ))
  .add('with wrapping', () => (
    <TagList tags={[
        'advocacy',
        'social justice',
        'activism',
        'reconciliation',
        'social',
        'psychology',
        'theology',
      ]}
    />
  ))
  .add('interactive', () => (
    <InteractiveTagList />
  ));
