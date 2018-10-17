import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import MeditationsIcon from './MeditationsIcon';
import SingleMediaItemScreen from './SingleMediaItemScreen';
import { getCommonNavigationOptions } from '../navigation/common';
import BackButton from '../navigation/BackButton';
import Meditation from '../state/models/Meditation';
import { meditationSelector } from '../state/ducks/orm/selectors';

/**
 * List of meditations in category, sorted by publish date.
 */
const SingleMeditationScreen = ({ meditation }) => (
  <SingleMediaItemScreen item={meditation} />
);

SingleMeditationScreen.propTypes = {
  meditation: PropTypes.shape(Meditation.propTypes).isRequired,
};

function mapStateToProps(state, { navigation }) {
  const { state: { params: { meditation } } } = navigation;
  return {
    meditation: meditationSelector(state, meditation.id),
  };
}

SingleMeditationScreen.navigationOptions = ({ screenProps }) => ({
  ...getCommonNavigationOptions(screenProps.drawer),
  headerLeft: <BackButton />,
  title: 'Meditations',
  tabBarIcon: MeditationsIcon,
  tabBarLabel: 'Meditations',
});

export default connect(mapStateToProps)(SingleMeditationScreen);
