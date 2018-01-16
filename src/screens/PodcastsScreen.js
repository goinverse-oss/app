import React from 'react';
import PropTypes from 'prop-types';
import { Text, View } from 'react-native';
import { connect } from 'react-redux';

import { getCommonNavigationOptions } from '../navigation/common';
import * as patreonSelectors from '../state/ducks/patreon/selectors';
import styles from '../styles';

/**
 * List of available podcasts.
 */
const PodcastsScreen = ({ isPatron }) => (
  <View style={styles.container}>
    <Text>
      Placeholder podcasts screen
    </Text>
    <Text>
      {
        isPatron
          ? 'As a patron, you can access the Conversations podcast.'
          : 'If you were a patron, you could access the Conversations podcast.'
      }
    </Text>
  </View>
);

PodcastsScreen.propTypes = {
  // true iff the user has connected Patreon
  isPatron: PropTypes.bool.isRequired,
};

PodcastsScreen.navigationOptions = ({ navigation }) => ({
  ...getCommonNavigationOptions(navigation),
  title: 'Podcasts',
});

function mapStateToProps(state) {
  return {
    isPatron: patreonSelectors.isPatron(state),
  };
}

export default connect(mapStateToProps)(PodcastsScreen);
