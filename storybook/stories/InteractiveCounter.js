import React from 'react';
import { View, Text, Button } from 'react-native';

import InteractionsCounter from '../../src/components/InteractionsCounter';

export default class InteractiveCounter extends React.Component {
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
          likes={this.state.likes + (this.state.liked ? 1 : 0)}
          comments={this.state.comments}
          onPressLike={this.onLike}
          {...this.props}
        />
        <Text>^ press heart</Text>
        <Button title="More likes" onPress={() => this.modify('likes', 1)} />
        <Button title="Fewer likes" onPress={() => this.modify('likes', -1)} />
        <Button title="More comments" onPress={() => this.modify('comments', 1)} />
        <Button title="Fewer comments" onPress={() => this.modify('comments', -1)} />
      </View>
    );
  }
}
