import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {
  Alert,
  Text,
  View,
  StyleSheet,
  ImageBackground,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';

import patreonButton from '../../assets/patreon_button_blank.png';

import CloseButton from '../navigation/CloseButton';

import * as actions from '../state/ducks/patreon/actions';
import * as selectors from '../state/ducks/patreon/selectors';
import * as ormActions from '../state/ducks/orm/actions';
import appStyles from '../styles';
import appPropTypes from '../propTypes';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
  },
  status: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 50,
  },
  heading: {
    color: 'white',
    fontSize: 34,
    fontWeight: '500',
  },
  text: {
    color: 'white',
    fontSize: 17,
    textAlign: 'center',
  },
  verification: {
    color: 'white',
    fontWeight: '600',
    fontSize: 17,
    textAlign: 'center',
    marginTop: 10,
  },
  disclaimer: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
  },
  buffer: {
    marginTop: 15,
  },
  button: {
    height: 43,
    width: 288,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: '900',

    // textTransform doesn't work on Android until react-native 0.57.4,
    // which will be part of Expo SDK 33.
    // textTransform: 'uppercase',

    marginLeft: 40,
    marginTop: -2.5,
    fontSize: 13,
  },
});

const notConnectedText = `
Log in and connect your account
to access meditations, liturgies, and
other bonus content.
`.trim();

const disclaimer = `
This app does not store, read, or even
think about your Patreon credentials.
`.trim();

function patronRewards(patronPodcasts, canAccessMeditations, canAccessLiturgies) {
  const extras = [];
  if (canAccessMeditations) {
    extras.push('- Meditations');
  }
  if (canAccessLiturgies) {
    extras.push('- Liturgies');
  }

  const podcasts = patronPodcasts.map(pod => `- ${pod.title}`).join('\n');

  return `
    ${podcasts}
    ${extras.join('\n')}
  `.trim();
}

const currentPatreonText = `
Thank you for supporting The Liturgists via
Patreon! You enable us to create even more
great content.
`.trim();

const nonPatronText = `
You are not currently a patron
of The Liturgists.
`.trim();

const waitingForDeviceVerificationText = `
Please check your email to verify your
device with Patreon.
`.trim();

function getPatronStatus(
  isConnected,
  isPatron,
) {
  if (isConnected) {
    return isPatron ? currentPatreonText : nonPatronText;
  }

  return notConnectedText;
}

const PatreonStatus = ({
  isConnected,
  isPatron,
  waitingForDeviceVerification,
  patronFirstName,
  patronPodcasts,
  canAccessMeditations,
  canAccessLiturgies,
}) => (
  <View style={styles.status}>
    <Text style={styles.heading}>
      {isConnected ? `Hello ${patronFirstName}!` : 'Connect Patreon'}
    </Text>
    <Text style={styles.text}>
      {getPatronStatus(isConnected, isPatron)}
    </Text>
    {
      waitingForDeviceVerification ? (
        <Text style={styles.verification}>
          {waitingForDeviceVerificationText}
        </Text>
      ) : null
    }
    {
      isPatron ? (
        <React.Fragment>
          <Text style={[styles.text, styles.buffer]}>
            {'You currently have access to:\n'}
          </Text>
          <Text style={styles.text}>
            {patronRewards(patronPodcasts, canAccessMeditations, canAccessLiturgies)}
          </Text>
        </React.Fragment>
      ) : null
    }
  </View>
);

PatreonStatus.propTypes = {
  isConnected: PropTypes.bool.isRequired,
  isPatron: PropTypes.bool.isRequired,
  waitingForDeviceVerification: PropTypes.bool.isRequired,
  patronFirstName: PropTypes.string.isRequired,
  patronPodcasts: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  canAccessMeditations: PropTypes.bool.isRequired,
  canAccessLiturgies: PropTypes.bool.isRequired,
};

const patreonStyles = {
  error: {
    color: 'red',
  },
};

function PatreonError({ error }) {
  if (!_.isError(error)) {
    return null;
  }

  return <Text style={patreonStyles.error}>{error.message}</Text>;
}

PatreonError.propTypes = {
  error: PropTypes.shape({}),
};
PatreonError.defaultProps = {
  error: null,
};

const PatreonButton = ({
  title,
  onPress,
  opacity,
  disabled,
}) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={disabled}
  >
    <ImageBackground
      source={patreonButton}
      style={styles.button}
      opacity={opacity}
    >
      <Text style={[styles.buttonText, { opacity }]}>{title}</Text>
    </ImageBackground>
  </TouchableOpacity>
);

PatreonButton.propTypes = {
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  opacity: PropTypes.number,
  disabled: PropTypes.bool,
};

PatreonButton.defaultProps = {
  opacity: 1.0,
  disabled: false,
};

const PatreonConnectButton = ({
  isConnected,
  connect: connectPatreon,
  disconnect,
  navigation,
}) => {
  const title = isConnected ? 'DISCONNECT PATREON' : 'CONNECT WITH PATREON';
  const onPress = (
    isConnected
      ? () => Alert.alert(
        'Are you sure?',
        'You will lose access to Patron-only content.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Disconnect',
            style: 'destructive',
            onPress: () => {
              disconnect();
            },
          },
        ],
      )
      : () => {
        connectPatreon();
        navigation.navigate('PatreonAuth');
      }
  );
  const opacity = isConnected ? 0.5 : 1.0;

  return (
    <PatreonButton
      title={title}
      onPress={onPress}
      opacity={opacity}
    />
  );
};

PatreonConnectButton.propTypes = {
  isConnected: PropTypes.bool.isRequired,
  connect: PropTypes.func.isRequired,
  disconnect: PropTypes.func.isRequired,
  navigation: appPropTypes.navigation.isRequired,
};

const PatreonRefreshButton = ({
  isConnected,
  getDetails,
  fetchData,
  loading,
}) => (
  isConnected ?
    <PatreonButton
      title={loading ? 'REFRESHING...' : 'REFRESH PATREON STATUS'}
      disabled={loading}
      opacity={loading ? 0.75 : 1.0}
      onPress={() => {
        getDetails();
        ['podcastEpisode', 'meditation', 'liturgyItem'].forEach(
          resource => fetchData({ resource }),
        );
      }}
    />
    : null
);

PatreonRefreshButton.propTypes = {
  isConnected: PropTypes.bool.isRequired,
  getDetails: PropTypes.func.isRequired,
  fetchData: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};


const PatreonScreen = props => (
  <View style={[appStyles.container, styles.container]}>
    <StatusBar barStyle="light-content" />
    <PatreonStatus {...props} />
    <PatreonRefreshButton {...props} />
    <PatreonConnectButton {...props} />
    {props.isPatron || (
      <Text style={styles.disclaimer}>
        {disclaimer}
      </Text>
    )}
  </View>
);

PatreonScreen.propTypes = {
  isConnected: PropTypes.bool.isRequired,
  isPatron: PropTypes.bool.isRequired,
  waitingForDeviceVerification: PropTypes.bool.isRequired,
  navigation: appPropTypes.navigation.isRequired,
};

PatreonScreen.navigationOptions = () => ({
  headerLeft: <CloseButton />,
  headerTransparent: true,
});

function mapStateToProps(state) {
  return {
    isConnected: selectors.isConnected(state),
    isPatron: selectors.isPatron(state),
    waitingForDeviceVerification: selectors.waitingForDeviceVerification(state),
    patronFirstName: selectors.firstName(state),
    patronPodcasts: selectors.patronPodcasts(state),
    canAccessPatronPodcasts: selectors.canAccessPatronPodcasts(state),
    canAccessMeditations: selectors.canAccessMeditations(state),
    canAccessLiturgies: selectors.canAccessLiturgies(state),
    loading: selectors.loading(state),
    error: selectors.error(state),
  };
}

const allActions = {
  ...actions,
  ...ormActions,
};

export default connect(mapStateToProps, allActions)(PatreonScreen);
