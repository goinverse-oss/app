import React from 'react';
import PropTypes from 'prop-types';
import { Image, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
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
  infoIcon: {
    fontSize: 25,
  },
});

const DrawerContent = ({ navigation }) => {
  const dispatch = useDispatch();

  return (
    <LinearGradient style={styles.drawer} colors={['#FFFFFF00', '#F95A570C']}>
      <PatreonStatus />
      <DrawerItem
        image={<Image source={patreonIcon} style={styles.patreonImage} />}
        title="Manage Patreon"
        onPress={() => {
          dispatch(patreon.getDetails());
          navigation.navigate('Patreon');
        }}
      />
      <DrawerItem
        title="Community"
        image={<Icon name="people" style={styles.communityIcon} />}
        onPress={() => navigation.navigate('Community')}
      />
      <DrawerItem
        image={<Icon name="info-outline" style={styles.infoIcon} />}
        title="About"
        onPress={() => navigation.navigate('About')}
      />
    </LinearGradient>
  );
};

DrawerContent.propTypes = {
  navigation: PropTypes.shape({}).isRequired,
};

export default DrawerContent;
