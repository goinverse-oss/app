import PropTypes from 'prop-types';
import { many, attr, Model } from 'redux-orm';
import propTypesMixin from '@theliturgists/redux-orm-proptypes';

const ValidatingModel = propTypesMixin(Model);

class Podcast extends ValidatingModel {}

Podcast.modelName = 'Podcast';

Podcast.fields = {
  title: attr(),
  description: attr(),
  imageUrl: attr(),
  largeImageUrl: attr(),
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
  largeImageUrl: PropTypes.string,
  createdAt: PropTypes.string,
  updatedAt: PropTypes.string,
};

export default Podcast;
