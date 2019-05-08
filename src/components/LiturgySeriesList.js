import React from 'react';
import PropTypes from 'prop-types';
import { ScrollView, StyleSheet, View } from 'react-native';

import LiturgySeriesTile from './LiturgySeriesTile';
import Liturgy from '../state/models/Liturgy';

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
  liturgies: PropTypes.arrayOf(
    PropTypes.shape(Liturgy.propTypes),
  ),
  onPressLiturgy: PropTypes.func,
};

LiturgySeriesList.defaultProps = {
  liturgies: [],
  onPressLiturgy: () => {},
};

export default LiturgySeriesList;
