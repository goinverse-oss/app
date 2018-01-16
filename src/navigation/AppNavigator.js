// Bootstrapped from the example app at https://reactnavigation.org/docs/guides/redux

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { BackHandler } from 'react-native';
import { connect } from 'react-redux';
import { TabNavigator, addNavigationHelpers, NavigationActions } from 'react-navigation';

import LoginScreen from '../screens/LoginScreen';
import MainNavigator from './MainNavigator';

export const RawNavigator = TabNavigator({
  Login: { screen: LoginScreen },
  Main: { screen: MainNavigator },
}, {
  navigationOptions: {
    tabBarVisible: false,
  },
});

class AppNavigator extends Component {
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
  }

  onBackPress() {
    const { dispatch, nav } = this.props;
    if (nav.index === 0) {
      return false;
    }
    dispatch(NavigationActions.back());
    return true;
  }

  render() {
    const { dispatch, nav } = this.props;
    const navigation = addNavigationHelpers({
      dispatch,
      state: nav,
    });

    return <RawNavigator navigation={navigation} />;
  }
}

AppNavigator.propTypes = {
  dispatch: PropTypes.func.isRequired,

  nav: PropTypes.shape({}).isRequired,
};

function mapStateToProps(state) {
  return {
    nav: state.navigation,
  };
}

export default connect(mapStateToProps)(AppNavigator);
