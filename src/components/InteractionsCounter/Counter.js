import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet } from 'react-native';
import _ from 'lodash';
import numeral from 'numeral';


function getLabelNode(label) {
  if (_.isString(label)) {
    return <Text>{label}</Text>;
  }

  // else assume it's already a node
  return label;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  text: {
    paddingLeft: 4,
  },
});

const Counter = ({ label, count, style }) => {
  const labelNode = getLabelNode(label);
  return (
    <View style={[styles.container, style]}>
      {labelNode}
      <Text style={{ paddingLeft: 4 }}>{numeral(count).format('0,0')}</Text>
    </View>
  );
};

Counter.propTypes = {
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
  ]),
  count: PropTypes.number,
  style: View.propTypes.style,
};

Counter.defaultProps = {
  label: 'Count',
  count: 0,
  style: {},
};

export default Counter;
