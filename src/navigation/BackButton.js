import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import { connect } from 'react-redux';

import Icon from '@expo/vector-icons/Ionicons';

import * as navActions from '../state/ducks/navigation/actions';

const styles = StyleSheet.create({
  backIcon: {
    fontSize: 36,
    paddingHorizontal: 10,
  },
});

/**
 * Button that, when pressed, opens the navigation drawer.
 */
const BackButton = ({ goBack }) => (
  <Icon
    name="ios-arrow-round-back"
    style={styles.backIcon}
    onPress={() => goBack()}
  />
);

BackButton.propTypes = {
  goBack: PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    goBack: () => dispatch(navActions.goBack()),
  };
}

export default connect(null, mapDispatchToProps)(BackButton);
