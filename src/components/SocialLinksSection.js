import React from 'react';
import {
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';


import mastodonIcon from '../../assets/discussion-buttons/mastodon.png';
import slackIcon from '../../assets/discussion-buttons/slack.png';

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 0,
  },
  title: {
    color: '#9B9B9B',
    fontWeight: '600',
    fontSize: 17,
    marginRight: 5,
  },
  linkContainer: {
    marginVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  linkImageContainer: {
    width: 150,
    height: 50,
  },
  linkImageStyle: {
    flex: 1,
    width: undefined,
    height: undefined,
    resizeMode: 'contain',
  },
  mastodonIconContainer: {
  },
  slackIconContainer: {
  },
});

const links = [
  {
    imageSource: mastodonIcon,
    url: 'https://social.theliturgists.com',
    style: styles.mastodonIconContainer,
    label: 'Talk on Mastodon',
  },
  {
    imageSource: slackIcon,
    url: 'https://join.slack.com/t/theliturgistsspace/shared_invite/enQtODY2MTA2OTI0NDIzLWZhYjIzZmQ3NTI3YTFiY2Q2M2M2NDQwODUwYmYzMTFhNmYwZmUwMWVmZWU4NmY3MzcwYzVkNDFlMWY1ZTAzMjI',
    style: styles.slackIconContainer,
    label: 'Discuss in Slack',
  },
];

const SocialLinksSection = () => (
  <View>
    <View style={styles.header}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Connect and discuss</Text>
      </View>
    </View>
    <View style={styles.linkContainer}>
      {links.map(({
        imageSource, url, style, label,
      }) => (
        <TouchableWithoutFeedback
          key={url}
          accessible
          accessibilityLabel={label}
          accessibilityHint="Opens a web browser"
          onPress={() => Linking.openURL(url)}
        >
          <View style={[styles.linkImageContainer, style]}>
            <Image style={styles.linkImageStyle} source={imageSource} />
          </View>
        </TouchableWithoutFeedback>
      ))}
    </View>
  </View>
);


export default SocialLinksSection;
