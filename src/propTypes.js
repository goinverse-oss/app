import PropTypes from 'prop-types';
import momentPropTypes from 'react-moment-proptypes';
import moment from 'moment-timezone';

import Meditation from './state/models/Meditation';
import PodcastEpisode from './state/models/PodcastEpisode';

const imageSource = PropTypes.shape({
  uri: PropTypes.string.isRequired,
});

export default {
  imageSource,

  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }),

  iconStyle: PropTypes.shape({
    fontSize: PropTypes.number,
  }),

  mediaItem: PropTypes.oneOfType(
    // TODO: other models
    [Meditation, PodcastEpisode].map(
      Model => PropTypes.shape(Model.propTypes).isRequired,
    ),
  ),

  person: PropTypes.shape({
    // TODO: expand as we use more of it
    name: PropTypes.string.isRequired,
    imageUrl: PropTypes.string.isRequired,
  }),

  liturgy: PropTypes.shape({
    title: PropTypes.string.isRequired,
    liturgyLength: PropTypes.number,
    publishedDate: momentPropTypes.momentObj.isRequired,
    imageUrl: PropTypes.string.isRequired,
  }),

  podcastEpisode: PropTypes.shape({
    // TODO: expand as we use more of it
    imageUrl: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    duration: momentPropTypes.momentDurationObj,
    publishedAt: momentPropTypes.momentObj,
  }),
  liturgyItem: PropTypes.shape({
    // TODO: expand as we use more of it
    imageUrl: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    duration: momentPropTypes.momentDurationObj,
    publishedAt: momentPropTypes.momentObj,
  }),
  meditation: PropTypes.shape({
    // TODO: expand as we use more of it
    imageUrl: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    duration: momentPropTypes.momentDurationObj,
    publishedAt: momentPropTypes.momentObj,
  }),
  event: PropTypes.shape({
    // TODO: expand as we use more of it
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    start: momentPropTypes.momentObj.isRequired,
    end: momentPropTypes.momentObj,

    // e.g. 'America/Detroit', 'Europe/Paris'
    timezone: PropTypes.oneOf(moment.tz.names()).isRequired,
  }),
  user: PropTypes.shape({
    // TODO: expand as we use more of it
    thumbUrl: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
  }),
  comment: PropTypes.shape({
    content: PropTypes.string.isRequired,
    createdAt: momentPropTypes.momentObj.isRequired,
  }),
};
