import React from 'react';
import PropTypes from 'prop-types';
import {
  Image,
  StyleSheet,
} from 'react-native';
import { withNavigation } from 'react-navigation';
import { LinearGradient } from 'expo';

import DrawerItem from './DrawerItem';
import PatreonStatus from './PatreonStatus';

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
}) => (
  <LinearGradient style={styles.drawer} colors={['#FFFFFF00', '#F95A570C']}>
    <PatreonStatus />
    <DrawerItem
      drawer={drawer}
      image={<Image source={patreonIcon} style={styles.patreonImage} />}
      title="Manage Patreon"
      onPress={() => navigation.navigate('Patreon')}
    />
  </LinearGradient>
);

DrawerContent.propTypes = {
  drawer: PropTypes.shape({}),
  navigation: appPropTypes.navigation.isRequired,
};

DrawerContent.defaultProps = {
  drawer: {},
};

export default withNavigation(DrawerContent);
