import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableWithoutFeedback, StyleSheet } from 'react-native';

import Button from './Button';
import CommentListCard from './CommentListCard';
import TextPill from './TextPill';

import appPropTypes from '../propTypes';

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 15,
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
  viewAll: {
    fontSize: 15,
    fontWeight: '600',
    color: '#F95A57',
  },

  // TODO: extract a ListButton that uses a ListCard instead of a Card
  addButton: {
    justifyContent: 'center',
    width: '94.7%',
    padding: 10,
    marginHorizontal: '2.7%',
    marginVertical: '2%',
  },
});

const AddCommentButton = props => (
  <Button style={styles.addButton} {...props}>
    <Text>Add a Comment</Text>
  </Button>
);

const CommentsSection = ({ comments, isExpanded, onViewAll }) => (
  <View>
    {isExpanded ? <AddCommentButton /> : (
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Comments</Text>
          <TextPill>{`${comments.length}`}</TextPill>
        </View>
        <View>
          <TouchableWithoutFeedback onPress={onViewAll}>
            <View>
              <Text style={styles.viewAll}>View All</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    )}
    <View>
      {comments
        .slice(0, isExpanded ? comments.length : 2)
        .map(comment => (
          <CommentListCard
            key={comment.id}
            comment={comment}
            isExpanded={isExpanded}
          />
        ))}
    </View>
    {isExpanded ? null : <AddCommentButton />}
  </View>
);

CommentsSection.propTypes = {
  comments: PropTypes.arrayOf(appPropTypes.comment),

  // True iff this CommentsSection is on its own screen
  // (i.e. after pressing "View All" on a model screen)
  isExpanded: PropTypes.bool,

  onViewAll: PropTypes.func,
};

CommentsSection.defaultProps = {
  comments: [],
  isExpanded: false,
  onViewAll: () => {},
};

export default CommentsSection;
