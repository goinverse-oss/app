import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet } from 'react-native';

import ListCard from './ListCard';
import InteractionsCounter from './InteractionsCounter';
import TextPill from './TextPill';

import appPropTypes from '../propTypes';

const styles = StyleSheet.create({
  card: {
    justifyContent: 'space-around',
    height: 164,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metadataContainer: {
    flex: 2,
  },
  counterContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
  },
  date: {
    fontSize: 13,
    color: '#9B9B9B',
  },
  location: {
    fontSize: 13,
    color: '#9B9B9B',
  },
  description: {
    fontSize: 14,
    color: '#9B9B9B',
  },
});

function formatDate({ start, end, timezone }) {
  if (!start) {
    return '';
  }

  const startLocal = start.clone().tz(timezone);

  const separator = ' • ';

  if (!end) {
    const strings = [startLocal.format('MMMM D, Y')];
    if (startLocal.hour() !== 0) {
      strings.push(startLocal.format('h:mm A'));
    }
    return strings.join(separator);
  }

  const endLocal = end.clone().tz(timezone);

  if (startLocal.date() !== endLocal.date() &&
      endLocal.diff(startLocal, 'hours') > 12) {
    return `${startLocal.format('MMMM D')} - ${endLocal.date()}, ${startLocal.year()}`;
  }

  return [
    startLocal.format('MMMM D, Y'),
    `${startLocal.format('h:mm A')} - ${endLocal.format('h:mm A')}`,
  ].join(separator);
}

const EventListCard = ({
  style,
  event,
  isSearchResult,
  ...props
}) => (
  <ListCard style={[styles.card, style]} {...props}>
    {isSearchResult ? <TextPill>Event</TextPill> : null}
    <View style={styles.header}>
      <View style={styles.metadataContainer}>
        <Text style={styles.title}>{event.title}</Text>
        <Text style={styles.date}>{formatDate(event)}</Text>
        <Text style={styles.location}>{event.location}</Text>
      </View>
      {isSearchResult ? null : (
        <View style={styles.counterContainer}>
          <InteractionsCounter />
        </View>
      )}
    </View>
    <Text style={styles.description} numberOfLines={isSearchResult ? 2 : 3}>
      {event.description}
    </Text>
  </ListCard>
);

EventListCard.propTypes = {
  style: View.propTypes.style,
  event: appPropTypes.event.isRequired,
  isSearchResult: PropTypes.bool,
};

EventListCard.defaultProps = {
  style: {},
  isSearchResult: false,
};

export default EventListCard;
