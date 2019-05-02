import React from 'react';
import PropTypes from 'prop-types';
import {
  TouchableWithoutFeedback,
  View,
  ViewPropTypes,
  Text,
  StyleSheet,
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#D2D2D2',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '500',
  },
});

const TextPill = ({ style, children, onPress }) => (
  <TouchableWithoutFeedback onPress={onPress}>
    <View style={[styles.container, style]}>
      <Text style={styles.text}>
        {children.toUpperCase()}
      </Text>
    </View>
  </TouchableWithoutFeedback>
);

TextPill.propTypes = {
  children: PropTypes.string.isRequired,

  // eslint-disable-next-line react/no-typos
  style: ViewPropTypes.style,

  onPress: PropTypes.func,
};

TextPill.defaultProps = {
  style: {},
  onPress: () => {},
};

export default TextPill;
