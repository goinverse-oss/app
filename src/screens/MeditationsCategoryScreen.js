import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ScrollView } from 'react-native';
import Icon from '@expo/vector-icons/Ionicons';

import { getCommonNavigationOptions } from '../navigation/common';
import BackButton from '../navigation/BackButton';
import MeditationListCard from '../components/MeditationListCard';
import * as patreonSelectors from '../state/ducks/patreon/selectors';
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
 * List of meditations in category, sorted by publish date.
 */
const MeditationsCategoryScreen = ({ meditations }) => (
  <ScrollView>
    {
      meditations.map(
        meditation => (
          <MeditationListCard
            key={meditation.id}
            meditation={meditation}
          />
        ),
      )
    }
  </ScrollView>
);

MeditationsCategoryScreen.propTypes = {
  meditations: PropTypes.arrayOf(
    PropTypes.shape({}),
  ),
};

MeditationsCategoryScreen.defaultProps = {
  meditations: [],
};

function mapStateToProps(state) {
  return {
    meditations: meditationsSelector(state),
    isPatron: patreonSelectors.isPatron(state),
  };
}

MeditationsCategoryScreen.navigationOptions = ({ screenProps, navigation }) => ({
  ...getCommonNavigationOptions(screenProps.drawer),
  headerLeft: <BackButton />,
  title: navigation.state.params.category.title,
  tabBarIcon: MeditationsIcon,
});

export default connect(mapStateToProps)(MeditationsCategoryScreen);
