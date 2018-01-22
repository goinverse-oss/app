import React from 'react';
import PropTypes from 'prop-types';

import { View, Text, TouchableWithoutFeedback } from 'react-native';

import Counter from './Counter';

// const LIKED_COLOR = '#F95A57';

const LikeIcon = ({ liked, onPressLike }) => (
  <TouchableWithoutFeedback onPress={onPressLike}>
    <View>
      <Text>{liked ? 'Unlike' : 'Like'}</Text>
    </View>
  </TouchableWithoutFeedback>
);

LikeIcon.propTypes = {
  liked: PropTypes.bool.isRequired,
  onPressLike: PropTypes.func.isRequired,
};

const InteractionsCounter = ({ likes, comments, ...props }) => (
  <View>
    <Counter label={<LikeIcon {...props} />} count={likes} />
    <Counter label="Comments" count={comments} />
  </View>
);

InteractionsCounter.propTypes = {
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
  liked: false,
  likes: 0,
  comments: 0,
  onPressLike: () => {},
  onPressComment: () => {},
};

export default InteractionsCounter;
