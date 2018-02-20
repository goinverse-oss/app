import PropTypes from 'prop-types';

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
};
