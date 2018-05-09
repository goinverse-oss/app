import React from 'react';
import PropTypes from 'prop-types';
import {
  Image,
  StyleSheet,
} from 'react-native';
import { connect } from 'react-redux';
import { LinearGradient } from 'expo';
import Icon from '@expo/vector-icons/Ionicons';

import DrawerItem from './DrawerItem';

import * as navActions from '../state/ducks/navigation/actions';
import * as authActions from '../state/ducks/auth/actions';

import patreonIcon from '../../assets/patreon_icon.png';

const styles = StyleSheet.create({
  drawer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: 'white',
    paddingLeft: '10%',
  },
  patreonImage: {
    width: 35,
    height: 35,
  },
  logoutIcon: {
    fontSize: 20,
    color: '#ccc',
  },
});

const DrawerContent = ({
  drawer,
  managePatreon,
  logout,
}) => (
  <LinearGradient style={styles.drawer} colors={['#FFFFFF00', '#F95A570C']}>
    <DrawerItem
      drawer={drawer}
      image={<Image source={patreonIcon} style={styles.patreonImage} />}
      title="Manage Patreon"
      onPress={() => managePatreon()}
    />
    <DrawerItem
      image={<Icon name="md-log-out" style={styles.logoutIcon} />}
      title="Log Out"
      onPress={() => logout()}
    />
  </LinearGradient>
);

DrawerContent.propTypes = {
  drawer: PropTypes.shape({}),
  managePatreon: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
};

DrawerContent.defaultProps = {
  drawer: {},
};

function mapDispatchToProps(dispatch) {
  return {
    managePatreon: () => {
      dispatch(navActions.managePatreon());
    },
    logout: () => {
      dispatch(authActions.logout());
      dispatch(navActions.logout());
    },
  };
}

export default connect(null, mapDispatchToProps)(DrawerContent);
