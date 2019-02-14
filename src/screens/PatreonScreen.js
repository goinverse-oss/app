import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Text, View, Button, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import Icon from '@expo/vector-icons/MaterialIcons';

import * as actions from '../state/ducks/patreon/actions';
import * as selectors from '../state/ducks/patreon/selectors';
import appStyles from '../styles';

const styles = StyleSheet.create({
  closeIcon: {
    fontSize: 24,
    paddingHorizontal: 10,
  },
});

function formatPledge(pledge) {
  const pledgeAmount = Math.floor(pledge.amount_cents / 100);
  return `$${pledgeAmount}`;
}

const PatreonStatus = ({
  isPatron,
  pledge,
  getDetails,
  canAccessPatronPodcasts,
  canAccessMeditations,
}) => (
  <View>
    <Text>Patreon status</Text>
    <Text>{`Patron: ${isPatron ? 'yes' : 'no'}`}</Text>
    { isPatron && (
      <React.Fragment>
        <Text>{`Pledge: ${formatPledge(pledge)}`}</Text>
        <Text>{`Patron-only podcast: ${canAccessPatronPodcasts}`}</Text>
        <Text>{`Meditations: ${canAccessMeditations}`}</Text>
      </React.Fragment>
    )}
    {isPatron &&
      <Button onPress={() => getDetails()} title="Refresh" />
    }
  </View>
);

PatreonStatus.propTypes = {
  isPatron: PropTypes.bool.isRequired,
  pledge: PropTypes.shape({
    amount_cents: PropTypes.number.isRequired,
  }).isRequired,
  getDetails: PropTypes.func.isRequired,
  canAccessPatronPodcasts: PropTypes.bool.isRequired,
  canAccessMeditations: PropTypes.bool.isRequired,
};

function getTitle(isPatron) {
  return `${isPatron ? 'Disconnect' : 'Connect'} Patreon`;
}

function PatreonControl({
  isPatron,
  loading,
  connect: connectPatreon,
  disconnect,
}) {
  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <Button
      onPress={() => {
        if (isPatron) {
          disconnect();
        } else {
          connectPatreon();
        }
      }}
      title={getTitle(isPatron)}
    />
  );
}

PatreonControl.propTypes = {
  isPatron: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  connect: PropTypes.func.isRequired,
  disconnect: PropTypes.func.isRequired,
};

const patreonStyles = {
  error: {
    color: 'red',
  },
};

function PatreonError({ error }) {
  if (!_.isError(error)) {
    return null;
  }

  return <Text style={patreonStyles.error}>{error.message}</Text>;
}

PatreonError.propTypes = {
  error: PropTypes.instanceOf(Error),
};
PatreonError.defaultProps = {
  error: null,
};

const PatreonScreen = props => (
  <View style={appStyles.container}>
    <PatreonStatus {...props} />
    <PatreonControl {...props} />
    <PatreonError error={props.error} />
  </View>
);

PatreonScreen.propTypes = {
  error: PropTypes.instanceOf(Error),
};

PatreonScreen.defaultProps = {
  error: null,
};

PatreonScreen.navigationOptions = ({ navigation }) => ({
  headerLeft: (
    <Icon
      name="close"
      style={styles.closeIcon}
      onPress={() => navigation.goBack(null)}
    />
  ),
  title: 'Manage Patreon',
});

function mapStateToProps(state) {
  return {
    isPatron: selectors.isPatron(state),
    pledge: selectors.getPledge(state),
    canAccessPatronPodcasts: selectors.canAccessPatronPodcasts(state),
    canAccessMeditations: selectors.canAccessMeditations(state),
    loading: selectors.loading(state),
    error: selectors.error(state),
  };
}

export default connect(mapStateToProps, actions)(PatreonScreen);
