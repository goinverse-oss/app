import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet } from 'react-native';

import CircleImage from './CircleImage';
import ListCard from './ListCard';

import appPropTypes from '../propTypes';

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    paddingBottom: 15,
  },
  comment: {
    flex: 1,
    marginLeft: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  user: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
  },
  date: {
    fontSize: 13,
    color: '#CCCCCC',
  },
  commentText: {
    fontSize: 13,
    color: '#8A8A8F',
  },
});

const CommentListCard = ({
  style,
  comment,
  isExpanded,
  ...props
}) => (
  <ListCard style={[styles.card, style]} {...props}>
    <CircleImage
      source={{ uri: comment.user.thumbUrl }}
      style={styles.userThumb}
      diameter={50}
    />
    <View style={styles.comment}>
      <View style={styles.header}>
        <Text style={styles.user}>{comment.user.displayName}</Text>
        <Text style={styles.date}>{comment.createdAt.fromNow()}</Text>
      </View>
      <Text
        style={styles.commentText}
        numberOfLines={isExpanded ? null : 8}
      >
        {comment.content}
      </Text>
    </View>
  </ListCard>
);

CommentListCard.propTypes = {
  style: View.propTypes.style,
  comment: appPropTypes.comment.isRequired,
  isExpanded: PropTypes.bool,
};

CommentListCard.defaultProps = {
  style: {},
  isExpanded: true,
};

export default CommentListCard;
