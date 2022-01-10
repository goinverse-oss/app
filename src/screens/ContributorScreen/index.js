import React from 'react';
import PropTypes from 'prop-types';
import { Animated, ScrollView, StyleSheet, Text, View } from 'react-native';
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
import { defaultShadowStyle } from '../../styles';
import appPropTypes from '../../propTypes';

const diameter = 148;
const backdropWidth = screenRelativeWidth(3);
const imageTop = diameter * 0.75;
const headerFadeScrollRange = [
  imageTop + diameter,
  imageTop + (diameter * 1.25),
];

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
    top: imageTop,
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
  headerBackground: {
    flex: 1,
    backgroundColor: 'white',
    opacity: 0.0,
    ...defaultShadowStyle,
  },
});

function getHeaderOpacity(animatedValue) {
  return animatedValue ? animatedValue.interpolate({
    inputRange: headerFadeScrollRange,
    outputRange: [0.0, 1.0],
  }) : 0.0;
}

const HeaderBackground = ({ animatedValue }) => (
  <Animated.View
    style={[
      styles.headerBackground,
      {
        opacity: getHeaderOpacity(animatedValue),
      },
    ]}
  />
);

HeaderBackground.propTypes = {
  animatedValue: PropTypes.instanceOf(Animated.Value),
};

HeaderBackground.defaultProps = {
  animatedValue: null,
};

/**
 * Single contributor screen with bio and media.
 */
class ContributorScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      scrollY: new Animated.Value(0),
    };
  }

  componentDidMount() {
    const { scrollY } = this.state;
    this.props.navigation.setParams({ scrollY });
  }

  render() {
    const { contributor } = this.props;

    return (
      <ScrollView
        contentContainerStyle={styles.container}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: {
                  y: this.state.scrollY,
                },
              },
            },
          ],
        )}
      >
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
  }
}

ContributorScreen.propTypes = {
  contributor: PropTypes.shape(Contributor.propTypes).isRequired,
  navigation: appPropTypes.navigation.isRequired,
};

function makeMapStateToProps(state, { navigation }) {
  const { state: { params: { contributor } } } = navigation;
  return function mapStateToProps() {
    return {
      contributor: contributorSelector(state, contributor.id),
    };
  };
}

ContributorScreen.navigationOptions = ({ navigation }) => {
  const animatedValue = navigation.getParam('scrollY');

  return {
    headerLeft: () => <BackButton />,
    title: navigation.state.params.contributor.name,
    headerTitleStyle: {
      opacity: getHeaderOpacity(animatedValue),
    },
    headerTransparent: true,
    headerBackground: <HeaderBackground animatedValue={animatedValue} />,
  };
};

export default connect(makeMapStateToProps)(ContributorScreen);
