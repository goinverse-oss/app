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

const MeditationSeriesList = ({ meditationCategories, onPressMeditationCategory }) =>
  (
    <ScrollView>
      <View style={styles.list}>
        {meditationCategories.map(meditationCategory => (
          <MeditationSeriesTile
            key={meditationCategory.title}
            meditationCategory={meditationCategory}
            onPress={() => onPressMeditationCategory(meditationCategory)}
          />
        ))}
      </View>
    </ScrollView>
  );
MeditationSeriesList.propTypes = {
  meditationCategories: PropTypes.arrayOf(AppPropTypes.meditationCategory),
  onPressMeditationCategory: PropTypes.func,
};

MeditationSeriesList.defaultProps = {
  meditationCategories: [],
  onPressMeditationCategory: () => {},
};

export default MeditationSeriesList;
