import React, { Component } from 'react';
import { View, ScrollView, Text } from 'react-native';
import moment from 'moment';

import { storiesOf } from '@storybook/react-native';

import CommentListCard from '../../src/components/CommentListCard';
import CommentsSection from '../../src/components/CommentsSection';

function formatParagraphs(text) {
  return text
    .replace(/^\s+|\s+$/g, '')
    .replace(/^ +| +$/gm, '')
    .split('\n\n')
    .map(paragraph => paragraph.replace(/\n/gm, ' '))
    .join('\n\n');
}

const comments = [
  {
    user: {
      displayName: 'Hillary McBride',
      thumbUrl: 'https://static1.squarespace.com/static/52fd5845e4b074ebcf586e7b/t/5a6badbac83025fc416fad0d/1517006272426/IMG_E9818.JPG?format=1000w',
    },
    content: formatParagraphs(`
      Farm-to-table hella unicorn, direct trade chambray wayfarers lyft vape
      pickled chartreuse food truck skateboard knausgaard vexillologist
      live-edge. Mixtape locavore marfa sartorial. Pour-over four dollar toast
      green juice small batch. Trust fund normcore pickled wayfarers.
    `),
    createdAt: moment().subtract(12, 'minutes'),
    id: '1',
  },
  {
    user: {
      displayName: 'William Matthews',
      thumbUrl: 'https://static1.squarespace.com/static/52fd5845e4b074ebcf586e7b/t/5a6bae760d9297f24bc5cdb7/1517006456578/IMG_5962.jpg?format=1000w',
    },
    content: formatParagraphs(`
      Affogato +1 flannel bushwick poutine chicharrones celiac direct trade
      chia. Pug fixie trust fund hashtag poutine. Austin four dollar toast
      jianbing gluten-free next level 3 wolf moon neutra marfa.
      
      Portland adaptogen keytar keffiyeh brunch lomo. Banjo direct trade +1
      copper mug, snackwave lomo trust fund artisan wayfarers crucifix 90's
      poutine schlitz occupy. YOLO craft beer occupy butcher af hot chicken
      retro freegan.
    `),
    createdAt: moment().subtract(27, 'hours'),
    id: '2',
  },
  {
    user: {
      displayName: 'Rachel Held Evans',
      thumbUrl: 'https://static1.squarespace.com/static/4f63ddf524ac9f2c23f422a4/5046a2eec4aa7e7d99011b46/54d7c403e4b081035491e68b/1423426564356/0.jpeg',
    },
    content: formatParagraphs(`
      Lorem ipsum dolor amet craft beer brooklyn everyday carry kickstarter.
      Tacos butcher humblebrag post-ironic. Banjo raclette cornhole truffaut
      next level, YOLO photo booth cronut shaman neutra shoreditch.

      Vexillologist la croix flannel pour-over, cloud bread kitsch blue bottle.
      Street art food truck trust fund post-ironic. You probably haven't heard
      of them celiac biodiesel actually hammock lomo ethical wayfarers
      helvetica.
    `),
    createdAt: moment().subtract(3, 'days'),
    id: '3',
  },
  {
    user: {
      displayName: 'Mike McHargue',
      thumbUrl: 'https://static1.squarespace.com/static/52fd5845e4b074ebcf586e7b/t/5a6ba9f353450a161ce1ed85/1517005300833/Friday_Web+%2848+of+140%29.jpg?format=750w',
    },
    content: formatParagraphs(`
      Meditation freegan pitchfork, tote bag literally hoodie artisan small
      batch migas retro banjo venmo.

      Prism locavore synth, sustainable chillwave scenester +1 freegan kale
      chips food truck intelligentsia deep v. Coloring book kombucha chia,
      meditation marfa farm-to-table jean shorts poke tacos food truck
      hammock live-edge. Etsy pabst green juice tumblr, copper mug semiotics
      enamel pin humblebrag fashion axe salvia polaroid authentic scenester.

      Affogato jianbing bitters fixie knausgaard health goth put a bird on it.
    `),
    createdAt: moment().subtract(9, 'days'),
    id: '4',
  },
  {
    user: {
      displayName: 'Michael Gungor',
      thumbUrl: 'https://static1.squarespace.com/static/52fd5845e4b074ebcf586e7b/t/5a6ba93ce4966b17e0a8f736/1517005123872/Friday_Web+%2818+of+140%29.jpg?format=750w',
    },
    content: formatParagraphs(`
      Gluten-free everyday carry prism venmo squid, cronut taxidermy poke.
      Gentrify poutine you probably haven't heard of them iceland 90's hexagon,
      kinfolk intelligentsia hella humblebrag godard kale chips. Succulents
      occupy adaptogen sriracha master cleanse fixie activated charcoal tbh
      banjo gentrify artisan synth chia.

      Hot chicken cronut hexagon, irony aesthetic franzen meh. Artisan
      gastropub man bun, chambray scenester hot chicken fam. Wayfarers
      vexillologist waistcoat butcher ethical beard selvage VHS live-edge
      chartreuse ennui.
    `),
    createdAt: moment().subtract(2, 'weeks'),
    id: '5',
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
    <View>
      <Text>Tap to expand/collapse</Text>
      <ScrollView>
        {comments.map(comment => (
          <ExpandableComment key={comment.id} comment={comment} />
        ))}
        <View style={{ height: 150 }} />
      </ScrollView>
    </View>
  ))
  .add('section', () => (
    <ScrollView>
      <CommentsSection comments={comments} />
    </ScrollView>
  ))
  .add('section (expanded)', () => (
    <ScrollView>
      <CommentsSection comments={comments} isExpanded />
    </ScrollView>
  ));
