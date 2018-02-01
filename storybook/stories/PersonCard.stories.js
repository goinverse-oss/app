import React from 'react';

import { storiesOf } from '@storybook/react-native';

import PersonCard from '../../src/components/PersonCard';

const rhe = {
  name: 'Rachel Held Evans',
  imageSource: {
    uri: 'https://static1.squarespace.com/static/4f63ddf524ac9f2c23f422a4/5046a2eec4aa7e7d99011b46/54d7c403e4b081035491e68b/1423426564356/0.jpeg',
  },
};

storiesOf('Person cards', module)
  .add('with Rachel Held Evans', () => (
    <PersonCard person={rhe} style={{ marginLeft: 20 }} />
  ));
