import React from 'react';
import PropTypes from 'prop-types';
import { ScrollView, StyleSheet } from 'react-native';

import AppPropTypes from '../propTypes';
import PersonCard from './PersonCard';

const styles = StyleSheet.create({
  list: {
    flexGrow: 0,
  },
  card: {
    marginHorizontal: 5,
  },
});

const PersonList = ({ people, onPressPerson }) => (
  <ScrollView horizontal style={styles.list}>
    {people.map(person => (
      <PersonCard
        key={person.name}
        person={person}
        onPress={() => onPressPerson(person)}
        style={styles.card}
      />
    ))}
  </ScrollView>
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
