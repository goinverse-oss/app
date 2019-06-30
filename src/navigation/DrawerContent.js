import React from 'react';
import PropTypes from 'prop-types';
import {
  Image,
  NativeModules,
  StyleSheet,
} from 'react-native';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import { LinearGradient } from 'expo-linear-gradient';

import DrawerItem from './DrawerItem';
import PatreonStatus from './PatreonStatus';

import * as patreon from '../state/ducks/patreon/actions';

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
  navigateToPatreon,
}) => (
  <LinearGradient style={styles.drawer} colors={['#FFFFFF00', '#F95A570C']}>
    <PatreonStatus />
    <DrawerItem
      drawer={drawer}
      image={<Image source={patreonIcon} style={styles.patreonImage} />}
      title="Manage Patreon"
      onPress={navigateToPatreon}
    />
    <DrawerItem
      drawer={drawer}
      title="Open dev menu"
      onPress={() => NativeModules.DevMenu.show()}
    />
  </LinearGradient>
);

DrawerContent.propTypes = {
  drawer: PropTypes.shape({}),
  navigateToPatreon: PropTypes.func.isRequired,
};

DrawerContent.defaultProps = {
  drawer: {},
};

function mapDispatchToProps(dispatch, { navigation }) {
  return {
    navigateToPatreon: () => {
      dispatch(patreon.getDetails());
      navigation.navigate('Patreon');
    },
  };
}

export default withNavigation(
  connect(null, mapDispatchToProps)(DrawerContent),
);
