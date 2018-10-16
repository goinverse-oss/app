import React from 'react';
import PropTypes from 'prop-types';
import {
  Image,
  StyleSheet,
} from 'react-native';
import { withNavigation } from 'react-navigation';
import { connect } from 'react-redux';
import { LinearGradient } from 'expo';
import Icon from '@expo/vector-icons/Ionicons';

import DrawerItem from './DrawerItem';

import * as authActions from '../state/ducks/auth/actions';

import patreonIcon from '../../assets/patreon_icon.png';
import appPropTypes from '../propTypes';

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
  navigation,
  logout,
}) => (
  <LinearGradient style={styles.drawer} colors={['#FFFFFF00', '#F95A570C']}>
    <DrawerItem
      drawer={drawer}
      image={<Image source={patreonIcon} style={styles.patreonImage} />}
      title="Manage Patreon"
      onPress={() => navigation.navigate('Patreon')}
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
  logout: PropTypes.func.isRequired,
  navigation: appPropTypes.navigation.isRequired,
};

DrawerContent.defaultProps = {
  drawer: {},
};

function mapDispatchToProps(dispatch, { navigation }) {
  return {
    logout: () => {
      dispatch(authActions.logout());
      navigation.navigate('Login');
    },
  };
}

export default withNavigation(
  connect(null, mapDispatchToProps)(DrawerContent),
);
