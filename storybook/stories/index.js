import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, Button } from 'react-native';

import { storiesOf } from '@storybook/react-native';

import InteractionsCounter from '../../src/components/InteractionsCounter';
import CircleImage from '../../src/components/CircleImage';

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

storiesOf('Counters', module)
  .add('with no counts', () => (
    <InteractionsCounter />
  ))
  .add('with counts', () => (
    <InteractionsCounter likes={42} comments={10} />
  ))
  .add('with counts above 1000', () => (
    <InteractionsCounter likes={42000} comments={1024} />
  ))
  .add('with user like', () => (
    <InteractionsCounter liked likes={42} comments={10} />
  ))
  .add('with interaction', () => (
    <InteractiveCounter />
  ));

const CircleImageOnBackground = ({ diameter, ...props }) => (
  <View style={{ alignItems: 'center' }}>
    <View
      style={{
        backgroundColor: '#F95A57',
        height: diameter,
        width: '100%',
      }}
    />
    <CircleImage
      source={{ uri: 'https://static1.squarespace.com/static/562efabfe4b0025d39701a14/t/58ac9e7a9de4bbcc33bba92a/1487707778952/?format=500w' }}
      diameter={diameter}
      style={{ position: 'absolute', top: diameter / 2 }}
      {...props}
    />
  </View>
);

CircleImageOnBackground.propTypes = {
  diameter: PropTypes.number.isRequired,
};

storiesOf('Circle pics', module)
  .add('with no shadow', () => (
    <CircleImageOnBackground diameter={148} />
  ))
  .add('with shadow', () => (
    <CircleImageOnBackground diameter={148} shadow />
  ));
