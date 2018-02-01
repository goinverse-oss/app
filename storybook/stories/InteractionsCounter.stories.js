import React from 'react';

import { storiesOf } from '@storybook/react-native';

import InteractionsCounter from '../../src/components/InteractionsCounter';
import InteractiveCounter from './InteractiveCounter';

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
