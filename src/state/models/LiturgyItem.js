import PropTypes from 'prop-types';
import { fk, many, attr, Model } from 'redux-orm';
import propTypesMixin from '@theliturgists/redux-orm-proptypes';

const ValidatingModel = propTypesMixin(Model);

class LiturgyItem extends ValidatingModel {}

LiturgyItem.modelName = 'LiturgyItem';

LiturgyItem.fields = {
  title: attr(),
  description: attr(),
  imageUrl: attr(),
  largeImageUrl: attr(),
  mediaUrl: attr(),
  duration: attr(),
  publishedAt: attr(),
  liturgy: fk('Liturgy', 'items'),
  track: attr(),
  tags: many('Tag'),
  contributors: many('Contributor', 'liturgyItems'),
  patronsOnly: attr(),
  isFreePreview: attr(),
  discourseTopicUrl: attr(),
  createdAt: attr(),
  updatedAt: attr(),
};

LiturgyItem.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  imageUrl: PropTypes.string,
  largeImageUrl: PropTypes.string,
  mediaUrl: PropTypes.string,
  duration: PropTypes.string,
  track: PropTypes.number,
  publishedAt: PropTypes.string,
  patronsOnly: PropTypes.bool,
  isFreePreview: PropTypes.bool,
  discourseTopicUrl: PropTypes.string,
  createdAt: PropTypes.string,
  updatedAt: PropTypes.string,
};

export default LiturgyItem;
