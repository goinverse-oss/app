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
import Icon from '@expo/vector-icons/MaterialIcons';

import patreonButton from '../../assets/patreon_button_blank.png';
import patreonBackground from '../../assets/patreon_bg.png';

import * as actions from '../state/ducks/patreon/actions';
import * as selectors from '../state/ducks/patreon/selectors';
import * as ormActions from '../state/ducks/orm/actions';
import appStyles from '../styles';

const styles = StyleSheet.create({
  bg: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
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
  closeIcon: {
    color: '#cccccc',
    fontSize: 24,
    paddingHorizontal: 10,
  },
});

function formatPledge(pledge) {
  const pledgeAmount = Math.floor(pledge.amount_cents / 100);
  return `$${pledgeAmount}`;
}

const newPatronText = `
By supporting The Liturgists via Patreon, you
enable us to create even more content.
`.trim();

function patronRewards(canAccessMeditations) {
  const extras = canAccessMeditations ? `
    - Meditations
    - Liturgies
  ` : '';

  return `
    - Bonus podcast
    ${extras.trim()}
  `.trim();
}

const newPatronPitch = `
Pledge $5 per month and receive access to:

${patronRewards(true)}
`.trim();

const currentPatreonText = `
Thank you for supporting The Liturgists via
Patreon! You enable us to create even more
great content.
`.trim();


const patronUpsell = newPatronPitch
  .replace('Pledge', 'Increase your pledge to')
  .replace('month', 'month\n')
  .replace('- Bonus podcast\n', '');


const PatreonStatus = ({
  isPatron,
  patronFirstName,
  pledge,
  canAccessMeditations,
}) => (
  <View style={styles.status}>
    <Text style={styles.heading}>
      {isPatron ? `Hello ${patronFirstName}!` : 'Become a Patron'}
    </Text>
    <Text style={styles.text}>
      {isPatron ? currentPatreonText : newPatronText}
    </Text>
    { pledge && (
      <Text style={[styles.text, styles.buffer]}>
        {`Pledge Level: ${pledge.reward.title} (${formatPledge(pledge)})`}
      </Text>
    )}
    {
      isPatron ? (
        <React.Fragment>
          <Text style={[styles.text, styles.buffer]}>
            {'You currently have access to:\n'}
          </Text>
          <Text style={styles.text}>
            {patronRewards(canAccessMeditations)}
          </Text>
        </React.Fragment>
      ) : (
        <Text style={styles.text}>
          {newPatronPitch}
        </Text>
      )
    }
    {
      (!isPatron || canAccessMeditations) || (
        <Text style={[styles.text, styles.buffer]}>
          {patronUpsell}
        </Text>
      )
    }
  </View>
);

PatreonStatus.propTypes = {
  isPatron: PropTypes.bool.isRequired,
  patronFirstName: PropTypes.string.isRequired,
  pledge: PropTypes.shape({
    amount_cents: PropTypes.number.isRequired,
  }),
  canAccessMeditations: PropTypes.bool.isRequired,
};

PatreonStatus.defaultProps = {
  pledge: null,
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
      : () => connectPatreon()
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
  <View style={appStyles.container}>
    <StatusBar barStyle="light-content" />
    <ImageBackground style={styles.bg} source={patreonBackground}>
      <PatreonStatus {...props} />
      <PatreonRefreshButton {...props} />
      <PatreonConnectButton {...props} />
    </ImageBackground>
  </View>
);

PatreonScreen.propTypes = {
  isConnected: PropTypes.bool.isRequired,
  isPatron: PropTypes.bool.isRequired,
  connect: PropTypes.func.isRequired,
};

PatreonScreen.navigationOptions = ({ navigation }) => ({
  headerLeft: (
    <Icon
      name="close"
      style={styles.closeIcon}
      onPress={() => navigation.goBack(null)}
    />
  ),
  headerTransparent: true,
});

function mapStateToProps(state) {
  return {
    isConnected: selectors.isConnected(state),
    isPatron: selectors.isPatron(state),
    patronFirstName: selectors.firstName(state),
    pledge: selectors.getPledge(state),
    canAccessPatronPodcasts: selectors.canAccessPatronPodcasts(state),
    canAccessMeditations: selectors.canAccessMeditations(state),
    loading: selectors.loading(state),
    error: selectors.error(state),
  };
}

const allActions = {
  ...actions,
  ...ormActions,
};

export default connect(mapStateToProps, allActions)(PatreonScreen);
