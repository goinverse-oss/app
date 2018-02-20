import React from 'react';
import PropTypes from 'prop-types';

import { StyleSheet, View, TouchableWithoutFeedback } from 'react-native';
import Icon from '@expo/vector-icons/FontAwesome';

import Counter from './Counter';

const LIKED_COLOR = '#F95A57';
const UNLIKED_COLOR = '#D2D2D2';

const LikeIcon = ({ liked, onPressLike }) => (
  <TouchableWithoutFeedback onPress={onPressLike}>
    <View>
      <Icon
        name="heart"
        size={16}
        color={liked ? LIKED_COLOR : UNLIKED_COLOR}
      />
    </View>
  </TouchableWithoutFeedback>
);

LikeIcon.propTypes = {
  liked: PropTypes.bool.isRequired,
  onPressLike: PropTypes.func.isRequired,
};

const COMMENT_COLOR = '#9B9B9B';

const CommentIcon = () => (
  <Icon name="comment" size={16} color={COMMENT_COLOR} />
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  commentsCounter: {
    paddingLeft: 4,
  },
});

const InteractionsCounter = ({
  style, likes, comments, ...props
}) => (
  <View style={[styles.container, style]}>
    <Counter label={<LikeIcon {...props} />} count={likes} />
    <Counter style={styles.commentsCounter} label={<CommentIcon />} count={comments} />
  </View>
);

InteractionsCounter.propTypes = {
  style: View.propTypes.style,

  // whether the active user has liked the thing
  liked: PropTypes.bool,

  // number of likes for the thing
  likes: PropTypes.number,

  // number of comments for the thing
  comments: PropTypes.number,

  // callback invoked when the 'like' icon is pressed for the thing.
  // arguments TBD
  onPressLike: PropTypes.func,

  // callback invoked when the 'comment' icon is pressed for the thing.
  // arguments TBD
  onPressComment: PropTypes.func,
};

InteractionsCounter.defaultProps = {
  style: {},
  liked: false,
  likes: 0,
  comments: 0,
  onPressLike: () => {},
  onPressComment: () => {},
};

export default InteractionsCounter;
