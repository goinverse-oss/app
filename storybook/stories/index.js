import React from 'react';
import { View, Button } from 'react-native';

import { storiesOf } from '@storybook/react-native';

import InteractionsCounter from '../../src/components/InteractionsCounter';

class InteractiveCounter extends React.Component {
  constructor() {
    super();
    this.state = {
      liked: false,
      likes: 0,
      comments: 0,
    };
    this.onLike = this.onLike.bind(this);
    this.modify = this.modify.bind(this);
  }

  onLike() {
    this.setState({ liked: !this.state.liked });
  }

  modify(type, delta) {
    this.setState({ [type]: this.state[type] + delta });
  }

  render() {
    return (
      <View>
        <InteractionsCounter
          liked={this.state.liked}
          likes={this.state.likes}
          comments={this.state.comments}
          onPressLike={this.onLike}
          {...this.props}
        />
        <Button title="More likes" onPress={() => this.modify('likes', 1)} />
        <Button title="Fewer likes" onPress={() => this.modify('likes', -1)} />
        <Button title="More comments" onPress={() => this.modify('comments', 1)} />
        <Button title="Fewer comments" onPress={() => this.modify('comments', -1)} />
      </View>
    );
  }
}

storiesOf('Counters', module)
  .add('with no counts', () => (
    <InteractionsCounter />
  ))
  .add('with counts', () => (
    <InteractionsCounter likes={42} comments={1024} />
  ))
  .add('with user like', () => (
    <InteractionsCounter liked likes={42} comments={1024} />
  ))
  .add('with interaction', () => (
    <InteractiveCounter />
  ));
