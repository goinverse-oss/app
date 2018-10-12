import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, Image, StyleSheet, Platform, TouchableWithoutFeedback } from 'react-native';
import { normalize } from 'react-native-elements';
import fonts from 'react-native-elements/src/config/fonts';
import colors from '../styles/colors';


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
  description: {
    fontSize: normalize(10),
    fontWeight: 'normal',
    color: colors.secondaryText,
    lineHeight: 16,
  },
});

const SeriesTile = ({
  onPress, imageUrl, title, description,
}) => (
  <TouchableWithoutFeedback onPress={onPress}>
    <View style={styles.container}>
      <Image source={{ uri: imageUrl }} style={styles.cardImage} />
      <View>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </View>
  </TouchableWithoutFeedback>
);

SeriesTile.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  onPress: PropTypes.func,
};

SeriesTile.defaultProps = {
  onPress: () => {},
};

export default SeriesTile;
