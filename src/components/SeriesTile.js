import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, Image, StyleSheet, Platform, TouchableWithoutFeedback } from 'react-native';
import { colors, normalize } from 'react-native-elements';
import fonts from 'react-native-elements/src/config/fonts';


const styles = StyleSheet.create({
  // Tile wrapper base
  container: {
    /*
        Styles to create 2 vertical columns
        of left justified columns. There might
        be a more efficient way of doing this
    */
    marginLeft: '2.7%',
    marginVertical: '2%',
    paddingHorizontal: '2.5%',
    paddingVertical: '2.5%',
    width: '46%',
    borderRadius: 4,
    backgroundColor: '#fff',
    ...Platform.select({
      ios: {
        shadowColor: colors.black,
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  viewWrapper: {
    paddingHorizontal: 0,
    marginHorizontal: 0,
    flex: 1,
  },
  cardImage: {
    flex: 1,
    aspectRatio: 1,
    resizeMode: 'cover',
    borderRadius: 4,
  },
  title: {
    fontSize: normalize(12),
    color: colors.black,
    lineHeight: 20,
    paddingTop: 14.5,
    paddingBottom: 5,
    ...Platform.select({
      ios: {
        fontWeight: '700',
      },
      android: {
        ...fonts.android.medium,
      },
    }),
  },
});

const SeriesTile = props => (
  <TouchableWithoutFeedback onPress={props.onPress}>
    <View style={styles.container}>
      <Image source={props.imageSource} style={styles.cardImage} />
      <View>
        <Text style={styles.title}>{props.title}</Text>
      </View>
      {props.description}
    </View>
  </TouchableWithoutFeedback>
);

SeriesTile.propTypes = {
  imageSource: PropTypes.shape({
    uri: PropTypes.string.isRequired,
  }).isRequired,
  title: PropTypes.string.isRequired,
  // triggerNavigation: PropTypes.func.isRequired,
  description: PropTypes.element.isRequired,
  onPress: PropTypes.func,
};

SeriesTile.defaultProps = {
  onPress: () => {},
};

export default SeriesTile;
