import PropTypes from 'prop-types';
import momentPropTypes from 'react-moment-proptypes';
import { many, attr, Model } from 'redux-orm';
import propTypesMixin from '@theliturgists/redux-orm-proptypes';

const ValidatingModel = propTypesMixin(Model);

class Podcast extends ValidatingModel {}

Podcast.modelName = 'Podcast';

Podcast.fields = {
  title: attr(),
  description: attr(),
  imageUrl: attr(),
  tags: many('Tag'),
  contributors: many('Contributor'),
  // episodes: created implicitly by fk() on PodcastEpisode
  createdAt: attr(),
  updatedAt: attr(),
};

Podcast.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  imageUrl: PropTypes.string,
  createdAt: momentPropTypes.momentObj,
  updatedAt: momentPropTypes.momentObj,
};

export default Podcast;
