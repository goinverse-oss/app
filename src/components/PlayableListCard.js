import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { View, Text, StyleSheet } from 'react-native';
import momentPropTypes from 'react-moment-proptypes';
import Icon from '@expo/vector-icons/Foundation';

import ListCard from './ListCard';
import SquareImage from './SquareImage';
import InteractionsCounter from './InteractionsCounter';

import AppPropTypes from '../propTypes';

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 106,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    position: 'absolute',
    fontSize: 16,
    color: '#fff',
  },
  playCircle: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,
    borderColor: '#fff',
    borderWidth: 2,
  },
  metadataContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginLeft: 10,
  },
  textContainer: {
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
  },
  description: {
    fontSize: 12,
    color: '#797979',
    height: '45%',
    marginVertical: '2%',
    flexWrap: 'wrap',
    flexDirection: 'column',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  times: {
    fontSize: 12,
    color: '#797979',
  },
});

function formatFooter({ duration, publishDate, formatDuration }) {
  const separator = ' • ';
  const strings = [];
  if (!_.isNull(duration)) {
    strings.push(formatDuration(duration));
  }
  if (!_.isNull(publishDate)) {
    strings.push(publishDate.fromNow());
  }
  return strings.join(separator);
}

const PlayableListCard = ({
  coverImageSource,
  style,
  title,
  description,
  duration,
  publishDate,
  formatDuration,
  ...props
}) => (
  <ListCard style={[styles.card, style]} {...props}>
    <View style={styles.imageContainer}>
      <SquareImage
        source={coverImageSource}
        width={86}
      />
      <Icon name="play" style={styles.playIcon} />
      <View style={styles.playCircle} />
    </View>
    <View style={styles.metadataContainer}>
      <View style={styles.textContainer}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        <Text style={styles.description} numberOfLines={2}>{description}</Text>
      </View>
      <View style={styles.footer}>
        <Text style={styles.times}>
          {formatFooter({ duration, publishDate, formatDuration })}
        </Text>
        <InteractionsCounter />
      </View>
    </View>
  </ListCard>
);

PlayableListCard.propTypes = {
  coverImageSource: AppPropTypes.imageSource.isRequired,
  style: View.propTypes.style,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  duration: momentPropTypes.momentDurationObj,
  publishDate: momentPropTypes.momentObj,
  formatDuration: PropTypes.func,
};

PlayableListCard.defaultProps = {
  style: {},
  duration: null,
  publishDate: null,
  formatDuration: m => `${m.asMinutes()} minutes`,
};

export default PlayableListCard;
