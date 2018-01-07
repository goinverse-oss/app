import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-native';
import { connect } from 'react-redux';

import * as navActions from '../state/ducks/navigation/actions';
import * as authActions from '../state/ducks/auth/actions';

const LogoutButton = ({ logout }) => (
  <Button
    onPress={() => logout()}
    title="Log Out"
  />
);

LogoutButton.propTypes = {
  logout: PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    logout: () => {
      dispatch(authActions.logout());
      dispatch(navActions.logout());
    },
  };
}

export default connect(null, mapDispatchToProps)(LogoutButton);
