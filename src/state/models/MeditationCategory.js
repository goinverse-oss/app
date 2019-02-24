import PropTypes from 'prop-types';
import { many, attr, Model } from 'redux-orm';
import propTypesMixin from '@theliturgists/redux-orm-proptypes';

const ValidatingModel = propTypesMixin(Model);

class MeditationCategory extends ValidatingModel {}

MeditationCategory.modelName = 'MeditationCategory';

MeditationCategory.fields = {
  title: attr(),
  description: attr(),
  imageUrl: attr(),
  largeImageUrl: attr(),
  tags: many('Tag'),
  // meditations: created implicitly by fk() on Meditation
  createdAt: attr(),
  updatedAt: attr(),
};

MeditationCategory.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  imageUrl: PropTypes.string,
  largeImageUrl: PropTypes.string,
  createdAt: PropTypes.string,
  updatedAt: PropTypes.string,
};

export default MeditationCategory;
