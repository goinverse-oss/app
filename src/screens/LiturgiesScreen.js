import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ScrollView, RefreshControl } from 'react-native';

import appPropTypes from '../propTypes';
import LiturgySeriesList from '../components/LiturgySeriesList';
import Liturgy from '../state/models/Liturgy';
import { fetchData } from '../state/ducks/orm';
import {
  liturgiesSelector,
  apiLoadingSelector,
} from '../state/ducks/orm/selectors';

/**
 * List of available liturgies.
 */
class LiturgiesScreen extends Component {
  componentDidMount() {
    const { fetchLiturgyItems } = this.props;
    fetchLiturgyItems();
  }

  render() {
    const { liturgies, navigation } = this.props;
    return (
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={this.props.refreshing}
            onRefresh={() => this.props.fetchLiturgyItems()}
          />
        }
      >
        <LiturgySeriesList
          liturgies={liturgies}
          onPressLiturgy={liturgy => navigation.navigate(
            'Liturgy',
            { liturgy },
          )}
        />
      </ScrollView>
    );
  }
}

LiturgiesScreen.propTypes = {
  liturgies: PropTypes.arrayOf(
    PropTypes.shape(Liturgy.propTypes),
  ),
  fetchLiturgyItems: PropTypes.func.isRequired,
  refreshing: PropTypes.bool.isRequired,
  navigation: appPropTypes.navigation.isRequired,
};

LiturgiesScreen.defaultProps = {
  liturgies: [],
};

function mapStateToProps(state) {
  return {
    liturgies: liturgiesSelector(state),
    refreshing: apiLoadingSelector(state, 'liturgies'),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchLiturgyItems: () => dispatch(
      fetchData({
        resource: 'liturgyItems',
      }),
    ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LiturgiesScreen);
