import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { View, Text } from 'react-native';

function getLabelNode(label) {
  if (_.isString(label)) {
    return <Text>{label}</Text>;
  }

  // else assume it's already a node
  return label;
}

const Counter = ({ label, count }) => {
  const labelNode = getLabelNode(label);
  return (
    <View>
      {labelNode}
      <Text>{count}</Text>
    </View>
  );
};

Counter.propTypes = {
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
  ]),
  count: PropTypes.number,
};

Counter.defaultProps = {
  label: 'Count',
  count: 0,
};

export default Counter;
