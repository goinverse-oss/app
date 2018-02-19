import React from 'react';
import PropTypes from 'prop-types';
import { ScrollView, StyleSheet, View } from 'react-native';

import AppPropTypes from '../propTypes';
import PodcastSeriesTile from './PodcastSeriesTile';

const styles = StyleSheet.create({
  list: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
});

const PodcastSeriesList = ({ podcasts, onPressPodcast }) =>
  (
    <ScrollView>
      <View style={styles.list}>
        {podcasts.map(podcast => (
          <PodcastSeriesTile
            key={podcast.title}
            podcast={podcast}
            onPress={() => onPressPodcast(podcast)}
          />
        ))}
      </View>
    </ScrollView>
  );
PodcastSeriesList.propTypes = {
  podcasts: PropTypes.arrayOf(AppPropTypes.podcast),
  onPressPodcast: PropTypes.func,
};

PodcastSeriesList.defaultProps = {
  podcasts: [],
  onPressPodcast: () => {},
};

export default PodcastSeriesList;
