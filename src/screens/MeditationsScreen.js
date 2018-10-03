import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ScrollView } from 'react-native';
import Icon from '@expo/vector-icons/Ionicons';

import { getCommonNavigationOptions } from '../navigation/common';
import MeditationSeriesList from '../components/MeditationSeriesList';
import * as patreonSelectors from '../state/ducks/patreon/selectors';
import { fetchData } from '../state/ducks/orm';
import { meditationsSelector } from '../state/ducks/orm/selectors';

const MeditationsIcon = ({ tintColor }) => (
  <Icon
    name="md-sunny"
    style={{
      color: tintColor,
      fontSize: 24,
    }}
  />
);

MeditationsIcon.propTypes = {
  tintColor: PropTypes.string.isRequired,
};

/**
 * List of available meditations, organized by category.
 */
class MeditationsScreen extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchData({ resource: 'meditations' }));
  }

  render() {
    const { meditations } = this.props;
    const meditationCategories = [
      {
        title: 'All Meditations',
        meditationCount: meditations.length,
        imageSource: {
          uri: 'https://static1.squarespace.com/static/52fd5845e4b074ebcf586e7b/t/5a6b935be4966b484105c9d3/1516999519606/Centering+Prayer+Cover+Art.jpeg?format=500w',
        },
      },
    ];

    return (
      <ScrollView>
        <MeditationSeriesList
          meditationCategories={meditationCategories}
          onPressMeditationCategory={() => {}}
        />
      </ScrollView>
    );
  }
}

MeditationsScreen.propTypes = {
  meditations: PropTypes.arrayOf(
    PropTypes.shape({}),
  ),
  dispatch: PropTypes.func.isRequired,
};

MeditationsScreen.defaultProps = {
  meditations: [],
};

function mapStateToProps(state) {
  return {
    meditations: meditationsSelector(state),
    isPatron: patreonSelectors.isPatron(state),
  };
}

MeditationsScreen.navigationOptions = ({ screenProps }) => ({
  ...getCommonNavigationOptions(screenProps.drawer),
  title: 'Meditations',
  tabBarIcon: MeditationsIcon,
});

export default connect(mapStateToProps)(MeditationsScreen);
