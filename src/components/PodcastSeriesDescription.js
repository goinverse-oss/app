import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from '@expo/vector-icons/FontAwesome';
import PropTypes from 'prop-types';
import { colors, normalize } from 'react-native-elements';
import moment from 'moment';

const styles = StyleSheet.create({
  descriptionWrapper: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingBottom: 5,
  },
  subtext: {
    fontSize: normalize(10),
    fontWeight: 'normal',
    color: colors.secondaryText,
    lineHeight: 16,
  },
  descriptionIcon: {
    lineHeight: 17,
    marginHorizontal: 4,
  },
});

class PodcastSeriesDescription extends Component {
  renderTileDate = () => this.props.lastUpdated.fromNow();
  render() {
    return (
      <View style={styles.descriptionWrapper}>
        <Text style={styles.subtext}>{this.props.totalEpisodes} Episodes</Text>
        <Icon
          style={styles.descriptionIcon}
          name="circle"
          size={normalize(4)}
          color={colors.grey1}
        />
        <Text style={styles.subtext}>{this.renderTileDate()}</Text>
      </View>
    );
  }
}

PodcastSeriesDescription.propTypes = {
  totalEpisodes: PropTypes.number.isRequired,
  lastUpdated: PropTypes.instanceOf(moment).isRequired,
};

export default PodcastSeriesDescription;
