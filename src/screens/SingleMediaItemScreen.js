import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { ScrollView, View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';

import appPropTypes from '../propTypes';
import PlayableItemHeader from '../components/PlayableItemHeader';
import ItemDescription from '../components/ItemDescription';
import PersonList from '../components/PersonList';
import SocialLinksSection from '../components/SocialLinksSection';
import TagList from '../components/TagList';

import * as playbackActions from '../state/ducks/playback/actions';
import { getImageSource } from '../state/ducks/orm/utils';

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

const SingleMediaItemScreen = ({ item, play }) => (
  <ScrollView style={styles.container}>
    <View style={styles.subContainer}>
      <PlayableItemHeader
        coverImageSource={getImageSource(item)}
        title={item.title}
        description={item.description}
        duration={item.duration}
        publishedAt={item.publishedAt}
        onPlay={() => play()}
      />
      <View style={styles.divider} />
      <ItemDescription description={item.description} />
    </View>
    <View style={styles.peopleContainer}>
      <PersonList people={item.contributors} />
    </View>
    <View style={styles.subContainer}>
      <TagList tags={item.tags} />
      <SocialLinksSection />
    </View>
  </ScrollView>
);

SingleMediaItemScreen.propTypes = {
  item: appPropTypes.mediaItem.isRequired,
  play: PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch, { navigation, item }) {
  return {
    play: () => {
      dispatch(
        playbackActions.setPlaying(
          _.pick(item, ['type', 'id']),
        ),
      );
      navigation.navigate('Player');
    },
  };
}


export default withNavigation(
  connect(null, mapDispatchToProps)(SingleMediaItemScreen),
);
