import React from 'react';
import PropTypes from 'prop-types';
import { View, ScrollView, StyleSheet } from 'react-native';

import AppPropTypes from '../propTypes';
import PersonCard from './PersonCard';
import SectionHeader from './SectionHeader';

const styles = StyleSheet.create({
  list: {
    flexGrow: 0,
    marginVertical: 8,
  },
  card: {
    marginHorizontal: 5,
  },

  // pad the end of the list, inside the ScrollView,
  // so that it looks better in a containing screen
  // when scrolled.
  // XXX: bit of a hack. TODO: pull up to parent?
  pad: {
    width: 15,
  },
});

const PersonList = ({ people, onPressPerson }) => (
  <View>
    <SectionHeader>People</SectionHeader>
    <ScrollView horizontal style={styles.list}>
      {people.map(person => (
        <PersonCard
          key={person.name}
          person={person}
          onPress={() => onPressPerson(person)}
          style={styles.card}
        />
      ))}
      <View style={styles.pad} />
    </ScrollView>
  </View>
);

PersonList.propTypes = {
  people: PropTypes.arrayOf(AppPropTypes.person),
  onPressPerson: PropTypes.func,
};

PersonList.defaultProps = {
  people: [],
  onPressPerson: () => {},
};

export default PersonList;
