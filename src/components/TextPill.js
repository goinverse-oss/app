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
    backgroundColor: '#797979',
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

const TextPill = ({
  style, textStyle, children, onPress, ...props
}) => (
  <TouchableWithoutFeedback onPress={onPress}>
    <View style={[styles.container, style]}>
      <Text style={[styles.text, textStyle]} {...props}>
        {children ? children.toUpperCase() : ''}
      </Text>
    </View>
  </TouchableWithoutFeedback>
);

TextPill.propTypes = {
  children: PropTypes.string.isRequired,

  // eslint-disable-next-line react/no-typos
  style: ViewPropTypes.style,

  // eslint-disable-next-line react/no-typos
  textStyle: Text.propTypes.style,

  onPress: PropTypes.func,
};

TextPill.defaultProps = {
  style: {},
  textStyle: {},
  onPress: () => {},
};

export default TextPill;
