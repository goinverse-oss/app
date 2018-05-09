import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
  },
  text: {
    fontSize: 15,
    fontWeight: '600',
    color: '#4A4A4A',
  },
  image: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 35,
    height: 35,
    marginRight: '5%',
  },
});

const DrawerItem = ({
  drawer,
  image,
  title,
  onPress,
}) => (
  <TouchableWithoutFeedback
    onPress={() => {
      if (drawer) {
        drawer.closeDrawer();
      }
      onPress();
    }}
  >
    <View style={styles.container}>
      <View style={styles.image}>
        {image}
      </View>
      <Text style={styles.text}>{title}</Text>
    </View>
  </TouchableWithoutFeedback>
);

DrawerItem.propTypes = {
  drawer: PropTypes.shape({}),
  image: PropTypes.node,
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
};

DrawerItem.defaultProps = {
  drawer: null,
  image: null,
};

export default DrawerItem;
