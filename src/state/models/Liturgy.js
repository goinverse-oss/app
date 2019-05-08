import PropTypes from 'prop-types';
import { many, attr, Model } from 'redux-orm';
import propTypesMixin from '@theliturgists/redux-orm-proptypes';

const ValidatingModel = propTypesMixin(Model);

class Liturgy extends ValidatingModel {}

Liturgy.modelName = 'Liturgy';

Liturgy.fields = {
  title: attr(),
  description: attr(),
  imageUrl: attr(),
  largeImageUrl: attr(),
  tags: many('Tag'),
  contributors: many('Contributor'),
  // items: created implicitly by fk() on LiturgyItem
  createdAt: attr(),
  updatedAt: attr(),
};

Liturgy.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  imageUrl: PropTypes.string,
  largeImageUrl: PropTypes.string,
  createdAt: PropTypes.string,
  updatedAt: PropTypes.string,
};

export default Liturgy;
