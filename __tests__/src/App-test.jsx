import 'react-native';
import React from 'react';
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import App from '../../src/App';

it('renders correctly', () => {
  const app = <App />;
  const tree = renderer.create(app).toJSON();
  expect(tree).toMatchSnapshot();
});
