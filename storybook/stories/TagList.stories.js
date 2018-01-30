import React from 'react';

import { storiesOf } from '@storybook/react-native';

import TagList from '../../src/components/TagList';

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
  ));
