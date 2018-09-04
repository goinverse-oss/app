import PropTypes from 'prop-types';
import momentPropTypes from 'react-moment-proptypes';
import { attr, Model } from 'redux-orm';
import propTypesMixin from 'redux-orm-proptypes';

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
  createdAt: momentPropTypes.momentObj,
  updatedAt: momentPropTypes.momentObj,
};

export default Tag;
