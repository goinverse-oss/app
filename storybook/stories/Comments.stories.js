import React, { Component } from 'react';
import { ScrollView, Text } from 'react-native';
import moment from 'moment';

import { storiesOf } from '@storybook/react-native';

import CommentListCard from '../../src/components/CommentListCard';

const comments = [
  {
    user: {
      displayName: 'Hillary McBride',
      thumbUrl: 'https://static1.squarespace.com/static/52fd5845e4b074ebcf586e7b/t/5a6badbac83025fc416fad0d/1517006272426/IMG_E9818.JPG?format=1000w',
    },
    content: `
      Farm-to-table hella unicorn, direct trade chambray wayfarers lyft vape
      pickled chartreuse food truck skateboard knausgaard vexillologist
      live-edge. Mixtape locavore marfa sartorial. Pour-over four dollar toast
      green juice small batch. Trust fund normcore pickled wayfarers.
    `.replace(/\s+/g, ' '),
    createdAt: moment().subtract(12, 'minutes'),
  },
  {
    user: {
      displayName: 'William Matthews',
      thumbUrl: 'https://static1.squarespace.com/static/52fd5845e4b074ebcf586e7b/t/5a6bae760d9297f24bc5cdb7/1517006456578/IMG_5962.jpg?format=1000w',
    },
    content: `
      Affogato +1 flannel bushwick poutine chicharrones celiac direct trade
      chia. Pug fixie trust fund hashtag poutine. Austin four dollar toast
      jianbing gluten-free next level 3 wolf moon neutra marfa. Portland
      adaptogen keytar keffiyeh brunch lomo. Banjo direct trade +1 copper mug,
      snackwave lomo trust fund artisan wayfarers crucifix 90's poutine schlitz
      occupy. YOLO craft beer occupy butcher af hot chicken retro freegan.
    `.replace(/\s+/g, ' '),
    createdAt: moment().subtract(27, 'hours'),
  },
];

class ExpandableComment extends Component {
  constructor() {
    super();

    this.state = {
      isExpanded: false,
    };
  }

  onPress() {
    this.setState({
      isExpanded: !this.state.isExpanded,
    });
  }

  render() {
    return (
      <CommentListCard
        {...this.props}
        isExpanded={this.state.isExpanded}
        onPress={() => this.onPress()}
      />
    );
  }
}

storiesOf('Comments', module)
  .add('pressable', () => (
    <ScrollView>
      {comments.map(comment => (
        <ExpandableComment key={comment.id} comment={comment} />
      ))}
      <Text>Tap to expand/collapse</Text>
    </ScrollView>
  ));
