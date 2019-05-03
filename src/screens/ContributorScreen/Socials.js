import React from 'react';
import PropTypes from 'prop-types';
import { Linking, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { Entypo } from '@expo/vector-icons';

import Contributor from '../../state/models/Contributor';

const styles = StyleSheet.create({
  socials: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  socialButton: {
    fontSize: 22,
    color: '#8A8A8F',
    paddingHorizontal: 10,
  },
});

const getIconName = service => (service === 'website' ? 'globe' : service);

const SocialButton = ({ contributor, service }) => (
  <TouchableWithoutFeedback onPress={() => Linking.openURL(contributor[service])}>
    <Entypo name={getIconName(service)} style={styles.socialButton} />
  </TouchableWithoutFeedback>
);

const services = ['website', 'twitter', 'facebook', 'instagram'];

SocialButton.propTypes = {
  contributor: PropTypes.shape(Contributor.propTypes).isRequired,
  service: PropTypes.oneOf(services).isRequired,
};

const Socials = ({ contributor }) => (
  <View style={styles.socials}>
    {
      services.filter(
        service => !!contributor[service],
      ).map(
        service => <SocialButton key={service} contributor={contributor} service={service} />,
      )
    }
  </View>
);

Socials.propTypes = {
  contributor: PropTypes.shape(Contributor.proptypes).isRequired,
};

export default Socials;
