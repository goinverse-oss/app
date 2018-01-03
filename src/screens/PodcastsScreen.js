import React from 'react';
import PropTypes from 'prop-types';
import { Text, View, Button } from 'react-native';

import * as navActions from '../state/ducks/navigation/actions';

const PodcastsScreen = ({ navigation }) => (
  <View>
    <Text>
      Placeholder podcasts screen
    </Text>
    <Button
      onPress={() => navigation.dispatch(navActions.logout())}
      title="Log out"
    />
  </View>
);

PodcastsScreen.propTypes = {
  navigation: PropTypes.shape({
    dispatch: PropTypes.func.isRequired,
  }).isRequired,
};

export default PodcastsScreen;
