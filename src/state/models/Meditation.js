import PropTypes from 'prop-types';
import { fk, many, attr, Model } from 'redux-orm';
import propTypesMixin from '@theliturgists/redux-orm-proptypes';

const ValidatingModel = propTypesMixin(Model);

class Meditation extends ValidatingModel {}

Meditation.modelName = 'Meditation';

Meditation.fields = {
  title: attr(),
  description: attr(),
  imageUrl: attr(),
  largeImageUrl: attr(),
  mediaUrl: attr(),
  duration: attr(),
  publishedAt: attr(),
  patronsOnly: attr(),
  isFreePreview: attr(),
  category: fk('MeditationCategory', 'meditations'),
  tags: many('Tag'),
  contributors: many('Contributor', 'meditations'),
  createdAt: attr(),
  updatedAt: attr(),
};

Meditation.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  imageUrl: PropTypes.string,
  largeImageUrl: PropTypes.string,
  mediaUrl: PropTypes.string,
  duration: PropTypes.string,
  publishedAt: PropTypes.string,
  patronsOnly: PropTypes.bool,
  isFreePreview: PropTypes.bool,
  createdAt: PropTypes.string,
  updatedAt: PropTypes.string,
};

export default Meditation;
