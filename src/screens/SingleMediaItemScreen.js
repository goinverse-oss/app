import React from 'react';
import PropTypes from 'prop-types';
import { ScrollView, View, StyleSheet } from 'react-native';

import PlayableItemHeader from '../components/PlayableItemHeader';
import ItemDescription from '../components/ItemDescription';
import PersonList from '../components/PersonList';
import CommentsSection from '../components/CommentsSection';
import TagList from '../components/TagList';

import Meditation from '../state/models/Meditation';

const padding = 15;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
  },
  subContainer: {
    padding,
  },
  peopleContainer: {
    paddingVertical: padding,
    paddingLeft: padding,
  },
  divider: {
    height: 1,
    backgroundColor: '#EDEDED',
    marginVertical: 25,
  },
});

const SingleMediaItemScreen = ({ item }) => (
  <ScrollView style={styles.container}>
    <View style={styles.subContainer}>
      <PlayableItemHeader
        coverImageSource={{
          uri: item.imageUrl,
        }}
        title={item.title}
        description={item.description}
        duration={item.duration}
        publishedAt={item.publishedAt}
      />
      <View style={styles.divider} />
      <ItemDescription description={item.description} />
    </View>
    <View style={styles.peopleContainer}>
      <PersonList people={item.contributors} />
    </View>
    <View style={styles.subContainer}>
      <TagList tags={item.tags} />
      <CommentsSection />
    </View>
  </ScrollView>
);

SingleMediaItemScreen.propTypes = {
  item: PropTypes.oneOfType(
    // TODO: other models
    [Meditation].map(
      Model => PropTypes.shape(Model.propTypes).isRequired,
    ),
  ).isRequired,
};

export default SingleMediaItemScreen;
