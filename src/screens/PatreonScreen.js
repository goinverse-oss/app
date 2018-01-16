import React from 'react';
import PropType from 'prop-types';
import { Text, View, Button } from 'react-native';
import { connect } from 'react-redux';

import { getCommonNavigationOptions } from '../navigation/common';
import * as actions from '../state/ducks/patreon/actions';
import * as selectors from '../state/ducks/patreon/selectors';
import styles from '../styles';

function getTitle(isPatron) {
  return `${isPatron ? 'Disable' : 'Enable'} Patreon`;
}

const PatreonScreen = ({ isPatron, enable, disable }) => (
  <View style={styles.container}>
    <Text>
      Placeholder Patreon screen
    </Text>
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
  </View>
);

PatreonScreen.propTypes = {
  isPatron: PropType.bool.isRequired,
  enable: PropType.func.isRequired,
  disable: PropType.func.isRequired,
};

PatreonScreen.navigationOptions = ({ navigation }) => ({
  ...getCommonNavigationOptions(navigation),
  title: 'Manage Patreon',
});

function mapStateToProps(state) {
  return {
    isPatron: selectors.isPatron(state),
  };
}

export default connect(mapStateToProps, actions)(PatreonScreen);
