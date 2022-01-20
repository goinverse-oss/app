import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import SingleMediaItemScreen from './SingleMediaItemScreen';
import Meditation from '../state/models/Meditation';
import { meditationSelector } from '../state/ducks/orm/selectors';

/**
 * List of meditations in category, sorted by publish date.
 */
const SingleMeditationScreen = ({ meditation }) => (
  <SingleMediaItemScreen item={meditation} mediaType="meditationCategories" />
);

SingleMeditationScreen.propTypes = {
  meditation: PropTypes.shape(Meditation.propTypes),
};

SingleMeditationScreen.defaultProps = {
  meditation: null,
};

function mapStateToProps(state, { route }) {
  const { params: { meditation } } = route;
  return {
    meditation: meditationSelector(state, meditation.id),
  };
}

export default connect(mapStateToProps)(SingleMeditationScreen);
