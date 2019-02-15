import PropTypes from 'prop-types';
import { attr, Model } from 'redux-orm';
import propTypesMixin from '@theliturgists/redux-orm-proptypes';

const ValidatingModel = propTypesMixin(Model);

class Contributor extends ValidatingModel {}

Contributor.modelName = 'Contributor';

Contributor.fields = {
  name: attr(),
  url: attr(),
  imageUrl: attr(),
  twitter: attr(),
  facebook: attr(),
  createdAt: attr(),
  updatedAt: attr(),
};

Contributor.propTypes = {
  name: PropTypes.string,
  url: PropTypes.string,
  imageUrl: PropTypes.string,
  twitter: PropTypes.string,
  facebook: PropTypes.string,
  createdAt: PropTypes.string,
  updatedAt: PropTypes.string,
};

export default Contributor;
