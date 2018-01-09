import React from 'react';
import PropType from 'prop-types';
import _ from 'lodash';
import { Text, View, Button } from 'react-native';
import { connect } from 'react-redux';

import { getCommonNavigationOptions } from '../navigation/common';
import * as actions from '../state/ducks/patreon/actions';
import * as selectors from '../state/ducks/patreon/selectors';
import styles from '../styles';

function getTitle(isPatron) {
  return `${isPatron ? 'Disable' : 'Enable'} Patreon`;
}

function PatreonControl({
  isPatron,
  loading,
  enable,
  disable,
}) {
  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <Button
      onPress={() => {
        if (isPatron) {
          disable();
        } else {
          enable();
        }
      }}
      title={getTitle(isPatron)}
    />
  );
}

PatreonControl.propTypes = {
  isPatron: PropType.bool.isRequired,
  loading: PropType.bool.isRequired,
  enable: PropType.func.isRequired,
  disable: PropType.func.isRequired,
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
  <View style={styles.container}>
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
  ...getCommonNavigationOptions(navigation),
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
