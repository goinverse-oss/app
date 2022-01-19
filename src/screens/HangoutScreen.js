import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  StyleSheet,
  Text,
} from 'react-native';
import { connect } from 'react-redux';

import appStyles from '../styles';
import { screenRelativeWidth } from '../components/utils';
import CollapsibleStack from './CollapsibleStack';
import * as selectors from '../state/ducks/patreon/selectors';

const styles = StyleSheet.create({
  container: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
    width: screenRelativeWidth(0.8),
  },
  header: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 30,
  },
  link: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
});

const scheduleUrl = 'https://theliturgists.com/studio/schedule';

const rooms = [
  {
    title: 'The Coffee Shop',
    url: 'https://zoom.us/j/3346163892',
    description: `
      For coffee, tea, Topo Chico, or whatever is your drink of choice…
      Bring a drink and start up a conversation, or work where you don’t mind background noise.
    `,
  },
  {
    title: 'The Studio',
    url: 'https://zoom.us/j/3271876473',
    description: `
      A bookable room for any event - host your own event!
      Lead a yoga class, record a podcast, play with your band.
      Whatever you would do in a bookable space!
      Just add your event to <a href='${scheduleUrl}'>this schedule</a>.

      We also host our own events in this room, so feel free to
      look at the schedule and join those too.
    `,
  },
  {
    title: 'The Party',
    url: 'https://zoom.us/j/9892595248',
    description: `
      For anything and everything…
      Welcome to the wild card room. Anything goes.
      Dance Party? Charades? 24/7 Disney+ Marathon? Yes, yes, and yes.
    `,
  },
];

const HangoutScreen = ({ passcode }) => (
  <View style={appStyles.container}>
    <Text style={styles.header}>
      {`Passcode: ${passcode}`}
    </Text>
    <CollapsibleStack items={rooms} />
  </View>
);

HangoutScreen.propTypes = {
  passcode: PropTypes.string,
};

HangoutScreen.defaultProps = {
  passcode: null,
};

function mapStateToProps(state) {
  return {
    passcode: selectors.zoomRoomPasscode(state),
  };
}

export default connect(mapStateToProps)(HangoutScreen);
