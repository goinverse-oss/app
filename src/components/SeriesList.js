import React from 'react';
import PropTypes from 'prop-types';
import { ScrollView, StyleSheet, View } from 'react-native';

import { cardMargin } from './SeriesTile';

const styles = StyleSheet.create({
  list: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    padding: cardMargin,
  },
});

const SeriesList = ({ children }) => (
  <ScrollView>
    <View style={styles.list}>
      {children}
    </View>
  </ScrollView>
);

SeriesList.propTypes = {
  children: PropTypes.node.isRequired,
};

export default SeriesList;
