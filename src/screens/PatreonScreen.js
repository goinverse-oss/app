import React from 'react';
import PropType from 'prop-types';
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
  isPatron: PropType.bool.isRequired,
  loading: PropType.bool.isRequired,
  connect: PropType.func.isRequired,
  disconnect: PropType.func.isRequired,
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
  error: PropType.instanceOf(Error),
};
PatreonError.defaultProps = {
  error: null,
};

const PatreonScreen = props => (
  <View style={appStyles.container}>
    <Text>
      Placeholder Patreon screen
    </Text>
    <PatreonControl {...props} />
    <PatreonError error={props.error} />
  </View>
);

PatreonScreen.propTypes = {
  error: PropType.instanceOf(Error),
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
    loading: selectors.loading(state),
    error: selectors.error(state),
  };
}

export default connect(mapStateToProps, actions)(PatreonScreen);
