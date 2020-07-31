import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Button,
} from 'react-native';

import appStyles from '../styles';
import { screenRelativeWidth } from '../components/utils';

import CollapsibleStack from './CollapsibleStack';

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
  },
});

const officialSocials = [
  {
    title: 'Hangout Rooms',
    navRoute: 'Hangout',
    patronsOnly: true,
    description: `
      These are video call rooms hosted by Zoom that we’ve locked open so
      you can join liturgists from around the world at any time.
      Feel free to jump in and go with the flow.
      Tap to find details and descriptions for each room!
    `,
  },
  {
    title: 'Discourse',
    url: 'https://discourse.theliturgists.com',
    description: `
      Our primary platform for community formation.
      Our focus is intentionally open and supportive conversation.

      Think of this as a privacy focused alternative to Facebook Groups.
    `,
  },
  {
    title: 'Mastodon',
    url: 'https://social.theliturgists.com',
    description: `
      Mastodon is an open-source alternative to Twitter, with an
      architecture that helps prevent the kinds of mass harassment
      that is so common on Twitter.

      Think of it as Twitter for people who are sick of Twitter.
    `,
  },
];

const unofficialSocials = [
  {
    title: 'Facebook',
    url: 'https://www.facebook.com/groups/LiturgistsCommunity/',
    description: `
      The largest collection of listeners outside our official social media
      platforms is in this Facebook group—which itself has numerous offshoots
      centered around geography and identity.
    `,
  },
  {
    title: 'Reddit',
    url: 'https://www.reddit.com/r/theliturgists/',
    description: `
      <p>
        For anyone who uses reddit, there is a dedicated subreddit
        run by the same team that created the primary Facebook group.
      </p>
    `,
  },
  {
    title: 'Slack',
    url: 'https://join.slack.com/t/theliturgistsspace/shared_invite/enQtODY2MTA2OTI0NDIzLWZhYjIzZmQ3NTI3YTFiY2Q2M2M2NDQwODUwYmYzMTFhNmYwZmUwMWVmZWU4NmY3MzcwYzVkNDFlMWY1ZTAzMjI',
    description: `
      Originally created by The Liturgists, but now operated by a passionate community,
      The Liturgist Space on Slack may be the most quirky and interesting community of all.
    `,
  },
];

const CommunityScreen = () => {
  const [index, setIndex] = useState(null);

  return (
    <View style={appStyles.container}>
      <Text style={styles.header}>Official</Text>
      <CollapsibleStack
        items={officialSocials}
        index={index}
        setIndex={setIndex}
      />

      <Text style={styles.header}>Listener-Led</Text>
      <CollapsibleStack
        items={unofficialSocials}
        baseIndex={officialSocials.length}
        index={index}
        setIndex={setIndex}
      />
    </View>
  );
};

CommunityScreen.navigationOptions = ({ navigation }) => ({
  headerLeft: (
    <Button onPress={() => navigation.goBack(null)} title="Close" />
  ),
  title: 'Community',
});

export default CommunityScreen;
