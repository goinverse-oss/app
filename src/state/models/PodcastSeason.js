import PropTypes from 'prop-types';
import momentPropTypes from 'react-moment-proptypes';
import { fk, many, attr, Model } from 'redux-orm';
import propTypesMixin from '@theliturgists/redux-orm-proptypes';

const ValidatingModel = propTypesMixin(Model);

class PodcastSeason extends ValidatingModel {}

PodcastSeason.modelName = 'PodcastSeason';

PodcastSeason.fields = {
  number: attr(),
  title: attr(),
  description: attr(),
  imageUrl: attr(),
  podcast: fk('Podcast', 'seasons'),
  tags: many('Tag'),
  contributors: many('Contributor'),
  // episodes: created implicitly by fk() on PodcastEpisode
  createdAt: attr(),
  updatedAt: attr(),
};

PodcastSeason.propTypes = {
  number: PropTypes.number,
  title: PropTypes.string,
  description: PropTypes.string,
  imageUrl: PropTypes.string,
  createdAt: momentPropTypes.momentObj,
  updatedAt: momentPropTypes.momentObj,
};

export default PodcastSeason;
