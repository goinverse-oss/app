import PropTypes from 'prop-types';
import { fk, many, attr, Model } from 'redux-orm';
import propTypesMixin from '@theliturgists/redux-orm-proptypes';

const ValidatingModel = propTypesMixin(Model);

class PodcastEpisode extends ValidatingModel {}

PodcastEpisode.modelName = 'PodcastEpisode';

PodcastEpisode.fields = {
  title: attr(),
  description: attr(),
  imageUrl: attr(),
  largeImageUrl: attr(),
  mediaUrl: attr(),
  duration: attr(),
  publishedAt: attr(),
  podcast: fk('Podcast', 'episodes'),
  season: fk('PodcastSeason', 'episodes'),
  seasonEpisodeNumber: attr(),
  tags: many('Tag'),
  contributors: many('Contributor', 'podcastEpisodes'),
  patronsOnly: attr(),
  isFreePreview: attr(),
  discourseTopicUrl: attr(),
  createdAt: attr(),
  updatedAt: attr(),
};

PodcastEpisode.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  imageUrl: PropTypes.string,
  largeImageUrl: PropTypes.string,
  mediaUrl: PropTypes.string,
  duration: PropTypes.string,
  seasonEpisodeNumber: PropTypes.number,
  publishedAt: PropTypes.string,
  patronsOnly: PropTypes.bool,
  isFreePreview: PropTypes.bool,
  discourseTopicUrl: PropTypes.string,
  createdAt: PropTypes.string,
  updatedAt: PropTypes.string,
};

export default PodcastEpisode;
