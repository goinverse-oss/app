import React from 'react';
import PropTypes from 'prop-types';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import { connect } from 'react-redux';
import { Audio } from 'expo-av';

import headphones from '../../assets/welcome/headphones.png';
import sun from '../../assets/welcome/sun.png';
import group from '../../assets/welcome/group.png';
import mountains from '../../assets/welcome/mountains.png';
import samplePodcast from '../../assets/welcome/samples/podcast.mp3';
import sampleMeditation from '../../assets/welcome/samples/meditation.mp3';
import { screenRelativeWidth } from '../components/utils';
import CircleImage from '../components/CircleImage';
import { PlaybackButton } from './PlayerScreen/Controls';
import { setShowWelcome } from '../state/ducks/welcome/actions';
import appPropTypes from '../propTypes';

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingBottom: 35,
  },
  slideTop: {
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  slideBottom: {
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  image: {
    resizeMode: 'contain',
  },
  title: {
    color: '#333333',
    fontSize: 32,
    marginTop: 35,
    marginBottom: 14,
  },
  text: {
    color: '#797979',
    fontSize: 17,
    marginHorizontal: 44,
    textAlign: 'center',
  },
  sampleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 130,
  },
  sample: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  sampleText: {
    color: '#797979',
  },
  dot: {
    backgroundColor: '#D2D2D2',
  },
  activeDot: {
    backgroundColor: '#F95A57',
  },
  buttonText: {
    color: '#D2D2D2',
    fontSize: 17,
    fontWeight: '500',
    padding: 12,
  },
  welcomeButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F95A57',
    width: 176,
    height: 43,
    borderRadius: 4,
  },
  welcomeButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});

const backgroundColor = '#ffffff';
const placeholderImage = 'https://loremflickr.com/81/81';
const slides = [
  {
    key: 'podcasts',
    title: 'Thoughtful and Evocative',
    text: 'The Liturgists host honest, fearless conversations through multiple podcasts exploring the most important topics of our day through science, art, and faith.',
    textTestID: 'welcomeText1',
    image: headphones,
    imageStyle: {
      height: 143,
    },
    sample: {
      source: samplePodcast,
      label: 'Listen to a Sample',
    },
    testimonial: {
      image: { uri: `${placeholderImage}?random=1` },
      name: 'Jenny Veracruz',
      source: 'Twitter',
      text: 'This podcast does a great job of discussing the question, “Does God have a penis?” I’m very grateful for angsty theologians.',
    },
    backgroundColor,
  },
  {
    key: 'meditations',
    title: 'Rejuvenation',
    text: 'Guided meditations and liturgical art offer grounding and growth, no matter where you are in your spiritual journey.',
    textTestID: 'welcomeText2',
    image: sun,
    imageStyle: {
      height: 143,
    },
    sample: {
      source: sampleMeditation,
      label: 'Try a Meditation',
    },
    testimonial: {
      image: { uri: `${placeholderImage}?random=2` },
      name: 'Shauna Perry',
      source: 'Twitter',
      text: 'The “Names of God” meditation was an incredible experience for me. Thank you.',
    },
    backgroundColor,
  },
  {
    key: 'community',
    title: "It's Not Just You",
    text: 'Online communities and live events offer refuge to folks at the margins of organized religious and spiritual communities.',
    textTestID: 'welcomeText3',
    image: group,
    imageStyle: {
      width: screenRelativeWidth(1.0),
      height: 168,
      resizeMode: 'cover',
    },
    testimonial: {
      image: { uri: `${placeholderImage}?random=3` },
      name: 'Cameron Wiley',
      source: 'Twitter',
      text: 'I\'ve been messed up by a few episodes, but “God, Our Mother” royally effed me up.',
    },
    backgroundColor,
  },
  {
    key: 'welcome',
    title: 'Take the Next Step',
    text: 'Welcome to The Liturgists.\nTap below to get started.',
    textTestID: 'welcomeText4',
    image: mountains,
    imageStyle: {
      height: 93,
    },
    showContinueButton: true,
    backgroundColor,
  },
];

class Sample extends React.Component {
  constructor() {
    super();
    this.state = {
      isPaused: true,
      sound: null,
    };
  }

  componentWillUnmount() {
    const { sound } = this.state;
    if (sound) {
      sound.setOnPlaybackStatusUpdate(null);
      sound.stopAsync().then(
        () => sound.unloadAsync(),
      );
    }
  }

  loadSample() {
    const { sample } = this.props;

    const initialStatus = { positionMillis: 0 };
    return Audio.Sound.createAsync(
      sample.source,
      initialStatus,
      (status) => {
        if (status.didJustFinish) {
          const { sound } = this.state;
          if (sound) {
            sound.setStatusAsync(initialStatus);
          }
          this.setState(() => ({ isPaused: true }));
        }
      },
    ).then(
      ({ sound, status }) => {
        this.setState(() => ({ sound, status }));
        return sound;
      },
    );
  }

  togglePlayback() {
    const { isPaused, sound } = this.state;
    const soundPromise = sound ? Promise.resolve(sound) : this.loadSample();
    soundPromise.then((resolvedSound) => {
      const promise = isPaused ? resolvedSound.playAsync() : resolvedSound.pauseAsync();
      promise.then(
        () => this.setState(state => ({ isPaused: !state.isPaused })),
      );
    });
  }

  render() {
    const { sample } = this.props;
    const { isPaused } = this.state;
    return (
      <View style={styles.sample}>
        <PlaybackButton
          style={styles.playbackButton}
          isPaused={isPaused}
          onPress={() => this.togglePlayback()}
        />
        <Text style={styles.sampleText}>{sample.label}</Text>
      </View>
    );
  }
}

Sample.propTypes = {
  sample: PropTypes.shape({
    // the "number" is the asset number from a require() of the audio file
    source: PropTypes.number.isRequired,
    label: PropTypes.string.isRequired,
  }).isRequired,
};

const testimonialStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  imageContainer: {},
  image: {
    borderWidth: 0.25,
    marginRight: 14,
  },
  textContainer: {
    width: 270,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 2.5,
  },
  name: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333333',
    marginRight: 3,
  },
  source: {
    fontSize: 17,
    color: '#D2D2D2',
  },
  text: {
    fontSize: 13,
    color: '#797979',
  },
});

const Testimonial = ({
  image, name, source, text,
}) => (
  <View style={testimonialStyles.container}>
    <View style={testimonialStyles.imageContainer}>
      <CircleImage diameter={62} style={testimonialStyles.image} source={image} />
    </View>
    <View style={testimonialStyles.textContainer}>
      <View style={testimonialStyles.nameContainer}>
        <Text style={testimonialStyles.name}>
          {name}
        </Text>
        <Text style={testimonialStyles.source}>
          {`via ${source}`}
        </Text>
      </View>
      <Text style={testimonialStyles.text}>
        {text}
      </Text>
    </View>
  </View>
);

Testimonial.propTypes = {
  image: appPropTypes.imageSource.isRequired,
  name: PropTypes.string.isRequired,
  source: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};

const WelcomeButton = ({ title, onPress, ...props }) => (
  <TouchableOpacity onPress={onPress} {...props}>
    <View style={styles.welcomeButton}>
      <Text style={styles.welcomeButtonText}>{title}</Text>
    </View>
  </TouchableOpacity>
);

WelcomeButton.propTypes = {
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
};

const Slide = ({ item, closeWelcome }) => (
  <View style={styles.slide}>
    <View style={styles.slideTop}>
      <Image style={[styles.image, item.imageStyle]} source={item.image} />
      <Text style={styles.title}>{item.title}</Text>
    </View>
    <View style={styles.slideBottom}>
      <Text testID={item.textTestID} style={styles.text}>{item.text}</Text>
      <View style={styles.sampleContainer}>
        {
          item.sample && <Sample sample={item.sample} />
        }
      </View>
      {
        item.testimonial && (
          <Testimonial {...item.testimonial} />
        )
      }
      {
        item.showContinueButton && (
          <WelcomeButton
            title="Continue"
            testID="continueButton"
            onPress={() => closeWelcome()}
          />
        )
      }
    </View>
  </View>
);

Slide.propTypes = {
  item: PropTypes.shape({}).isRequired,
  closeWelcome: PropTypes.func.isRequired,
};

const navButton = label => () => (
  <Text
    style={styles.buttonText}
    accessibilityLabel={label}
    contentDescription={label}
    testID={`nav${label}`}
  >
    {label}
  </Text>
);

const WelcomeScreen = ({ closeWelcome }) => (
  <AppIntroSlider
    slides={slides}
    activeDotStyle={styles.activeDot}
    dotStyle={styles.dot}
    buttonTextStyle={styles.buttonText}
    showSkipButton
    showPrevButton
    showDoneButton={false}
    renderSkipButton={navButton('Skip')}
    renderPrevButton={navButton('Back')}
    renderNextButton={navButton('Next')}
    renderItem={item => <Slide item={item} closeWelcome={closeWelcome} />}
    onSkip={closeWelcome}
  />
);

WelcomeScreen.propTypes = {
  closeWelcome: PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    closeWelcome: () => dispatch(setShowWelcome(false)),
  };
}

export default connect(null, mapDispatchToProps)(WelcomeScreen);
