import PropTypes from 'prop-types';
import { attr, Model } from 'redux-orm';
import propTypesMixin from '@theliturgists/redux-orm-proptypes';

const ValidatingModel = propTypesMixin(Model);

class Tag extends ValidatingModel {}

Tag.modelName = 'Tag';

Tag.fields = {
  name: attr(),
  createdAt: attr(),
  updatedAt: attr(),
};

Tag.propTypes = {
  name: PropTypes.string,
  createdAt: PropTypes.string,
  updatedAt: PropTypes.string,
};

export default Tag;
