import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  ViewPropTypes,
  Text,
  StyleSheet,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';

import AppPropTypes from '../propTypes';
import CircleImage from './CircleImage';
import { getImageSource } from '../state/ducks/orm/utils';

const shadowRadius = 6;

const styles = StyleSheet.create({
  // TODO: extract the common card styles somewhere shared.
  card: {
    width: 90,
    height: 134,
    borderRadius: 4,
    marginBottom: shadowRadius,
    alignItems: 'center',
    backgroundColor: '#fff',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: {
          height: 2,
        },
        shadowRadius,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  picture: {
    paddingTop: 10,
  },
  name: {
    width: 70,
    paddingTop: 10,
    fontSize: 12,
    color: '#797979',
    textAlign: 'center',
  },
});

const PersonCard = ({ person, onPress, style }) => (
  <TouchableWithoutFeedback onPress={onPress}>
    <View style={[styles.card, style]}>
      <CircleImage
        source={getImageSource(person)}
        diameter={70}
        style={styles.picture}
      />
      <Text style={styles.name}>{person.name}</Text>
    </View>
  </TouchableWithoutFeedback>
);

PersonCard.propTypes = {
  person: AppPropTypes.person.isRequired,
  onPress: PropTypes.func,
  style: ViewPropTypes.style,
};

PersonCard.defaultProps = {
  onPress: () => {},
  style: null,
};

export default PersonCard;
