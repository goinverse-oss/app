import PropTypes from 'prop-types';
import momentPropTypes from 'react-moment-proptypes';
import { fk, many, attr, Model } from 'redux-orm';
import propTypesMixin from 'redux-orm-proptypes';

const ValidatingModel = propTypesMixin(Model);

class Meditation extends ValidatingModel {}

Meditation.modelName = 'Meditation';

Meditation.fields = {
  title: attr(),
  description: attr(),
  imageUrl: attr(),
  mediaUrl: attr(),
  duration: attr(),
  publishedAt: attr(),
  status: attr(),
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
  mediaUrl: PropTypes.string,
  duration: momentPropTypes.momentDurationObj,
  publishedAt: momentPropTypes.momentObj,
  status: PropTypes.oneOf(['published', 'draft']),
  createdAt: momentPropTypes.momentObj,
  updatedAt: momentPropTypes.momentObj,
};

export default Meditation;
