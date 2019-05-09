import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';

import PlayableListCard from './PlayableListCard';
import PodcastEpisode from '../state/models/PodcastEpisode';
import * as playbackSelectors from '../state/ducks/playback/selectors';

const PodcastEpisodeListCard = ({ item, elapsed, ...props }) => (
  <PlayableListCard
    item={item}
    elapsed={elapsed}
    {...props}
  />
);

PodcastEpisodeListCard.propTypes = {
  item: PropTypes.shape(
    PodcastEpisode.propTypes,
  ).isRequired,
  elapsed: PropTypes.string.isRequired,
};

function mapStateToProps(state, { item }) {
  const { id } = item;
  const status = playbackSelectors.getLastStatusForItem(state, id);
  const elapsed = status ? moment.duration(status.positionMillis, 'ms') : moment.duration();
  return {
    elapsed: elapsed.toString(),
  };
}

export default connect(mapStateToProps)(PodcastEpisodeListCard);
