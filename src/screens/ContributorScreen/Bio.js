import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';

import Button from '../../components/Button';
import Contributor from '../../state/models/Contributor';

const styles = StyleSheet.create({
  bio: {},
  bioTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#9B9B9B',
  },
  bioBody: {
    color: '#4A4A4A',
    fontSize: 15,
    lineHeight: 20,
    marginVertical: 10,
  },
  bioButton: {
    height: 44,
    alignSelf: 'auto',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  bioButtonText: {
    fontWeight: '600',
    color: '#797979',
    fontSize: 15,
  },
});

class Bio extends React.Component {
  constructor() {
    super();
    this.state = {
      expanded: false,
    };
  }

  render() {
    const { contributor } = this.props;
    const { expanded } = this.state;
    return (
      <View style={styles.bio}>
        <Text style={styles.bioTitle}>About</Text>
        <Text style={styles.bioBody} numberOfLines={expanded ? null : 10}>
          {contributor.bio}
        </Text>
        <Button
          style={styles.bioButton}
          onPress={() => this.setState({ expanded: !expanded })}
        >
          <Text style={styles.bioButtonText}>
            {`${expanded ? 'Hide' : 'View'} Full Bio`}
          </Text>
        </Button>
      </View>
    );
  }
}

Bio.propTypes = {
  contributor: PropTypes.shape(Contributor.proptypes).isRequired,
};

export default Bio;
