import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

import { storiesOf } from '@storybook/react-native';

import CircleImage from '../../src/components/CircleImage';

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
