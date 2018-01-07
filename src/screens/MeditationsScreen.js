import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Text, View } from 'react-native';

import { getCommonNavigationOptions } from '../navigation/common';
import styles from '../styles';

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
  isPatron: PropTypes.bool.isRequired,
};

function mapStateToProps(state) {
  return {
    isPatron: state.patreon.enabled,
  };
}

MeditationsScreen.navigationOptions = ({ navigation }) => ({
  ...getCommonNavigationOptions(navigation),
  title: 'Meditations',
});

export default connect(mapStateToProps)(MeditationsScreen);
