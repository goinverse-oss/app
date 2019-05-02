import PropTypes from 'prop-types';
import { attr, Model } from 'redux-orm';
import propTypesMixin from '@theliturgists/redux-orm-proptypes';

const ValidatingModel = propTypesMixin(Model);

class Contributor extends ValidatingModel {}

Contributor.modelName = 'Contributor';

Contributor.fields = {
  name: attr(),
  title: attr(),
  organization: attr(),
  bio: attr(),
  website: attr(),
  imageUrl: attr(),
  image: attr(),
  twitter: attr(),
  facebook: attr(),
  createdAt: attr(),
  updatedAt: attr(),
};

Contributor.propTypes = {
  name: PropTypes.string,
  title: PropTypes.string,
  organization: PropTypes.string,
  bio: PropTypes.string,
  website: PropTypes.string,
  imageUrl: PropTypes.string,
  image: PropTypes.string,
  twitter: PropTypes.string,
  facebook: PropTypes.string,
  createdAt: PropTypes.string,
  updatedAt: PropTypes.string,
};

export default Contributor;
