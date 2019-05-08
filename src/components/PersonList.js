import React from 'react';
import PropTypes from 'prop-types';
import { View, ScrollView, StyleSheet } from 'react-native';

import PersonCard from './PersonCard';
import SectionHeader from './SectionHeader';
import TextPill from './TextPill';
import Contributor from '../state/models/Contributor';

const styles = StyleSheet.create({
  list: {
    flexGrow: 0,
    marginVertical: 8,
  },
  card: {
    marginHorizontal: 5,
  },
  header: {
    flexDirection: 'row',
  },
  headerText: {
    marginRight: 6,
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
    <View style={styles.header}>
      <SectionHeader style={styles.headerText}>People</SectionHeader>
      <TextPill>{`${people.length}`}</TextPill>
    </View>
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
  people: PropTypes.arrayOf(
    PropTypes.shape(Contributor.propTypes),
  ),
  onPressPerson: PropTypes.func,
};

PersonList.defaultProps = {
  people: [],
  onPressPerson: () => {},
};

export default PersonList;
