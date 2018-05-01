import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Text, View } from 'react-native';
import Icon from '@expo/vector-icons/Ionicons';

import { getCommonNavigationOptions } from '../navigation/common';
import * as patreonSelectors from '../state/ducks/patreon/selectors';
import styles from '../styles';

const MeditationsIcon = ({ tintColor }) => (
  <Icon
    name="md-sunny"
    style={{
      color: tintColor,
      fontSize: 24,
    }}
  />
);

MeditationsIcon.propTypes = {
  tintColor: PropTypes.string.isRequired,
};
/**
 * List of available meditations, organized by category.
 */
const MeditationsScreen = ({ isPatron }) => (
  <View style={styles.container}>
    <Text>
      Placeholder meditations screen
    </Text>
    <Text>
      {
        isPatron
          ? 'As a patron, you can access the meditations.'
          : 'If you were a patron, you could access the meditations.'
      }
    </Text>
  </View>
);

MeditationsScreen.propTypes = {
  // true iff the user has connected Patreon
  isPatron: PropTypes.bool.isRequired,
};

function mapStateToProps(state) {
  return {
    isPatron: patreonSelectors.isPatron(state),
  };
}

MeditationsScreen.navigationOptions = ({ screenProps }) => ({
  ...getCommonNavigationOptions(screenProps.drawer),
  title: 'Meditations',
  tabBarIcon: MeditationsIcon,
});

export default connect(mapStateToProps)(MeditationsScreen);
