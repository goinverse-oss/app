import React from 'react';
import PropTypes from 'prop-types';
import { ScrollView, StyleSheet, View } from 'react-native';

import AppPropTypes from '../propTypes';
import MeditationSeriesTile from './MeditationSeriesTile';

const styles = StyleSheet.create({
  list: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
});

const MeditationSeriesList = ({ meditations, onPressMeditation }) =>
  (
    <ScrollView>
      <View style={styles.list}>
        {meditations.map(meditation => (
          <MeditationSeriesTile
            key={meditation.title}
            meditation={meditation}
            onPress={() => onPressMeditation(meditation)}
          />
        ))}
      </View>
    </ScrollView>
  );
MeditationSeriesList.propTypes = {
  meditations: PropTypes.arrayOf(AppPropTypes.meditation),
  onPressMeditation: PropTypes.func,
};

MeditationSeriesList.defaultProps = {
  meditations: [],
  onPressMeditation: () => {},
};

export default MeditationSeriesList;
