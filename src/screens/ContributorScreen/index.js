import React from 'react';
import PropTypes from 'prop-types';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { connect } from 'react-redux';

import Socials from './Socials';
import Bio from './Bio';
import Contributions from './Contributions';
import CircleImage from '../../components/CircleImage';
import BackButton from '../../navigation/BackButton';
import Contributor from '../../state/models/Contributor';
import { contributorSelector } from '../../state/ducks/orm/selectors';
import { getImageSource } from '../../state/ducks/orm/utils';
import { screenRelativeWidth } from '../../components/utils';

const diameter = 148;
const backdropWidth = screenRelativeWidth(3);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  backdrop: {
    backgroundColor: '#F95A57',
    height: backdropWidth,
    width: backdropWidth,
    borderRadius: backdropWidth,
    position: 'absolute',
    top: (diameter * 1.25) - backdropWidth,
  },
  image: {
    position: 'absolute',
    top: diameter * 0.75,
  },
  details: {
    alignItems: 'center',
    marginTop: diameter * 1.85,
    marginHorizontal: 17,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 3,
  },
  title: {
    color: '#8A8A8F',
    fontSize: 13,
  },
  organization: {
    color: '#8A8A8F',
    fontSize: 13,
  },
  contributionsContainer: {
    alignItems: 'flex-start',
    paddingHorizontal: 17,
    width: '100%',
  },
});

/**
 * Single contributor screen with bio and media.
 */
const ContributorScreen = ({ contributor }) => (
  <ScrollView contentContainerStyle={styles.container}>
    <View style={styles.backdrop} />
    <CircleImage
      source={getImageSource(contributor)}
      diameter={diameter}
      style={styles.image}
      shadow
    />
    <View style={styles.details}>
      <Text style={styles.name}>{contributor.name}</Text>
      <Text style={styles.title}>{contributor.title}</Text>
      <Text style={styles.organization}>{contributor.organization}</Text>
      <Socials contributor={contributor} />
      <Bio contributor={contributor} />
    </View>
    <View style={styles.contributionsContainer}>
      <Contributions type="podcastEpisode" contributor={contributor} />
      <Contributions type="meditation" contributor={contributor} />
      <Contributions type="liturgyItem" contributor={contributor} />
    </View>
  </ScrollView>
);

ContributorScreen.propTypes = {
  contributor: PropTypes.shape(Contributor.propTypes).isRequired,
};

function makeMapStateToProps(state, { navigation }) {
  const { state: { params: { contributor } } } = navigation;
  return function mapStateToProps() {
    return {
      contributor: contributorSelector(state, contributor.id),
    };
  };
}

ContributorScreen.navigationOptions = () => ({
  headerLeft: <BackButton />,
  title: '',
  headerTransparent: true,
});

export default connect(makeMapStateToProps)(ContributorScreen);
