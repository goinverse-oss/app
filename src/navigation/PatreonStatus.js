import React from 'react';
import PropTypes from 'prop-types';

import { View, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import CircleImage from '../components/CircleImage';

import * as selectors from '../state/ducks/patreon/selectors';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    marginLeft: 20,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4A4A4A',
    marginBottom: 3,
  },
  status: {
    fontSize: 14,
    color: '#9B9B9B',
  },
});

const PatreonStatus = ({
  imageUrl,
  name,
  status,
}) => (
  <View style={styles.container}>
    <View>
      <CircleImage
        source={{ uri: imageUrl }}
        diameter={81}
      />
    </View>
    <View style={styles.textContainer}>
      <Text style={styles.name}>
        {name}
      </Text>
      <Text style={styles.status}>
        {status}
      </Text>
    </View>
  </View>
);

PatreonStatus.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
};

function mapStateToProps(state) {
  const isConnected = selectors.isConnected(state);
  const pledge = selectors.getPledge(state);
  let status;
  if (isConnected) {
    status = pledge ? 'Patron' : 'Not a patron';
  } else {
    status = 'Not connected';
  }
  return {
    isConnected,
    imageUrl: selectors.imageUrl(state),
    name: selectors.fullName(state),
    status,
  };
}

export default connect(mapStateToProps)(PatreonStatus);
