import React from 'react';
import PropTypes from 'prop-types';
import { Image, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from '@expo/vector-icons/MaterialIcons';

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
  communityIcon: {
    fontSize: 25,
  },
  logoutIcon: {
    fontSize: 20,
    color: '#ccc',
  },
});

const DrawerContent = ({
  drawer,
  navigateToPatreon,
  navigateToCommunity,
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
      title="Community"
      image={<Icon name="people" style={styles.communityIcon} />}
      onPress={navigateToCommunity}
    />
  </LinearGradient>
);

DrawerContent.propTypes = {
  drawer: PropTypes.shape({}),
  navigateToPatreon: PropTypes.func.isRequired,
  navigateToCommunity: PropTypes.func.isRequired,
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
    navigateToCommunity: () => {
      navigation.navigate('Community');
    },
  };
}

export default withNavigation(
  connect(null, mapDispatchToProps)(DrawerContent),
);
