import PropTypes from 'prop-types';
import moment from 'moment';

const imageSource = PropTypes.shape({
  uri: PropTypes.string.isRequired,
});

export default {
  imageSource,

  person: PropTypes.shape({
    // TODO: expand as we use more of it
    name: PropTypes.string.isRequired,
    imageSource: imageSource.isRequired,
  }),

  podcast: PropTypes.shape({
    title: PropTypes.string.isRequired,
    episodeCount: PropTypes.number,
    lastUpdated: PropTypes.instanceOf(moment).isRequired,
    imageSource: imageSource.isRequired,
  }),

  meditation: PropTypes.shape({
    title: PropTypes.string.isRequired,
    meditationCount: PropTypes.number,
    imageSource: imageSource.isRequired,
  }),

  liturgy: PropTypes.shape({
    title: PropTypes.string.isRequired,
    liturgyLength: PropTypes.number,
    publishedDate: PropTypes.instanceOf(moment).isRequired,
    imageSource: imageSource.isRequired,
  }),

};
