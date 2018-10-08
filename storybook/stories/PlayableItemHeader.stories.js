import React from 'react';
import { View, StyleSheet } from 'react-native';
import { storiesOf } from '@storybook/react-native';
import moment from 'moment';

import PodcastEpisodeHeader from '../../src/components/PodcastEpisodeHeader';
import LiturgyItemHeader from '../../src/components/LiturgyItemHeader';
import MeditationHeader from '../../src/components/MeditationHeader';

const liturgistsPodcastImageUrl = 'https://static1.squarespace.com/static/52fd5845e4b074ebcf586e7b/t/5a6a579e8165f576bbd614c8/1516918687161/The+Liturgists+Podcast+Logo.jpg?format=750w';

const podcast = {
  imageUrl: liturgistsPodcastImageUrl,
  title: 'Enemies - Live from Los Angeles',
  description: (
    'This is a special live episode recorded at The Liturgists Gathering ' +
    'in Los Angeles, CA on September 15, 2017.'
  ),
  duration: moment.duration(88, 'minutes'),
  publishedAt: moment('2017-09-15'),
};

const gardenLiturgyImageUrl = 'https://f4.bcbits.com/img/a4076498522_16.jpg';

const liturgy = {
  imageUrl: gardenLiturgyImageUrl,
  title: '1. Friday',
  description: 'Amena Brown',
  duration: moment.duration(1, 'minutes'),
};

const meditation = {
  imageUrl: 'https://c10.patreonusercontent.com/3/eyJ3Ijo2MjAsIngiOjI0OTM3OTh9/patreon-posts/WkED08RyoZXTLW3fAdor61q_g4p_3xkoKYHM2_FX4mG5VDmm9EHq3tMzZfXufJLE.jpg?token-time=1520121600&token-hash=5q0qh-mUJDWF7a9CaCq3V8PbPb-qRai-O0iUVYIBa7w%3D',
  title: 'Letting Go',
  description: 'A meditation by Hillary McBride.',
  duration: moment.duration(12, 'minutes'),
  publishedAt: moment('2018-02-16T19:38:00-05:00'),
};

const styles = StyleSheet.create({
});

storiesOf('Playable item header', module)
  .add('Liturgies', () => (
    <LiturgyItemHeader style={styles.header} liturgyItem={liturgy} />
  ))
  .add('Meditations', () => (
    <MeditationHeader style={styles.header} meditation={meditation} />
  ))
  .add('Podcasts', () => (
    <PodcastEpisodeHeader style={styles.header} podcastEpisode={podcast} />
  ));
