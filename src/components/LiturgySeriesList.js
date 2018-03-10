import React from 'react';
import PropTypes from 'prop-types';
import { ScrollView, StyleSheet, View } from 'react-native';

import AppPropTypes from '../propTypes';
import LiturgySeriesTile from './LiturgySeriesTile';

const styles = StyleSheet.create({
  list: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
});

const LiturgySeriesList = ({ liturgies, onPressLiturgy }) =>
  (
    <ScrollView>
      <View style={styles.list}>
        {liturgies.map(liturgy => (
          <LiturgySeriesTile
            key={liturgy.title}
            liturgy={liturgy}
            onPress={() => onPressLiturgy(liturgy)}
          />
        ))}
      </View>
    </ScrollView>
  );
LiturgySeriesList.propTypes = {
  liturgies: PropTypes.arrayOf(AppPropTypes.liturgy),
  onPressLiturgy: PropTypes.func,
};

LiturgySeriesList.defaultProps = {
  liturgies: [],
  onPressLiturgy: () => {},
};

export default LiturgySeriesList;
