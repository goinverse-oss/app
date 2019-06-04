import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Alert, Clipboard, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from '@expo/vector-icons/Entypo';

import * as authSelectors from '../state/ducks/auth/selectors';
import config from '../../config.json';

const styles = StyleSheet.create({
  icon: {
    fontSize: 24,
    height: 30,
    paddingHorizontal: 20,
    marginTop: 3,
  },
});

function copyFeed(url) {
  Clipboard.setString(url);
  Alert.alert(
    'Feed URL Copied',
    'You can now paste this URL into your favorite podcast app.',
    [{ text: 'OK' }],
  );
}

const FeedButton = ({ url }) => (
  url ? (
    <TouchableOpacity onPress={() => copyFeed(url)}>
      <Icon
        name="rss"
        style={styles.icon}
      />
    </TouchableOpacity>
  ) : null
);

FeedButton.propTypes = {
  collection: PropTypes.shape({
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    feedUrl: PropTypes.string,
  }).isRequired,
  url: PropTypes.string,
};

FeedButton.defaultProps = {
  url: null,
};

function mapStateToProps(state, { collection }) {
  let url;
  if (collection.feedUrl) {
    url = collection.feedUrl;
  } else {
    const token = authSelectors.token(state);
    if (token) {
      const { type, id } = collection;
      url = `${config.apiBaseUrl}/rss/${type}/${id}?token=${token}`;
    }
  }

  return { url };
}

export default connect(mapStateToProps)(FeedButton);
