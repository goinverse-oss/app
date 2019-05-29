import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Animated, FlatList, ImageBackground, Text, View, StyleSheet } from 'react-native';
import { Constants } from 'expo';

import ParallaxScroll from '@monterosa/react-native-parallax-scroll';
import BackButton from '../navigation/BackButton';
import LiturgyItemListCard from '../components/LiturgyItemListCard';
import LiturgyItem from '../state/models/LiturgyItem';
import Liturgy from '../state/models/Liturgy';
import { formatLiturgyDescription } from '../components/LiturgySeriesTile';
import { liturgySelector, apiLoadingSelector } from '../state/ducks/orm/selectors';
import { fetchData } from '../state/ducks/orm';
import { screenRelativeWidth } from '../components/utils';
import { getImageSource } from '../state/ducks/orm/utils';


const coverImageWidth = screenRelativeWidth(1.0);
const coverImageHeight = coverImageWidth;
const headerHeight = 44 + Constants.statusBarHeight;
const overlap = 75;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 7,
  },
  card: {
    marginHorizontal: 14,
    marginVertical: 7,
  },
  header: {
    backgroundColor: '#ffffff',
    marginTop: Constants.statusBarHeight,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    position: 'absolute',
    fontWeight: '600',
    fontSize: 17,
  },
  headerTextWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerPlaceholder: {
    width: 61,
  },
  cover: {
    height: coverImageHeight,
    marginTop: 20,
  },
  coverTextContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  coverTitle: {
    fontSize: 32,
    fontWeight: '600',
    color: '#fff',
  },
  coverDescription: {
    fontSize: 13,
    color: '#fff',
  },
  background: {
    flex: 1,
    marginTop: headerHeight,
  },
});

function mapScrollToRange(animatedValue, outputRange) {
  return animatedValue.interpolate({
    inputRange: [0, coverImageHeight - headerHeight - overlap],
    outputRange,
  });
}

const Header = ({ liturgy, animatedValue }) => (
  <View style={styles.header}>
    <BackButton />
    <View style={styles.headerTextWrapper}>
      <Animated.Text
        style={[
          styles.headerText,
          {
            opacity: mapScrollToRange(animatedValue, [1, 0]),
          },
        ]}
      >
        Liturgies
      </Animated.Text>
      <Animated.Text
        style={[
          styles.headerText,
          {
            opacity: mapScrollToRange(animatedValue, [0, 1]),
          },
        ]}
      >
        {liturgy.title}
      </Animated.Text>
    </View>

    {/* placeholder for spacing */}
    <View style={styles.headerPlaceholder} />
  </View>
);

Header.propTypes = {
  liturgy: PropTypes.shape(Liturgy.propTypes).isRequired,
  animatedValue: PropTypes.instanceOf(Animated.Value).isRequired,
};

function formatLiturgyHeaderDetail(liturgy, items) {
  const tracks = `${items.length} tracks`;
  const description = formatLiturgyDescription(liturgy);
  const separator = ' • ';
  return [tracks, description].join(separator);
}


/**
 * List of items in liturgy, sorted by track number.
 */
const LiturgyScreen = ({
  liturgy,
  items,
  refreshing,
  refreshLiturgyItems,
}) => (
  <ParallaxScroll
    height={null}
    headerHeight={headerHeight}
    parallaxHeight={coverImageHeight - overlap}
    renderHeader={props => <Header liturgy={liturgy} {...props} />}
    headerBackgroundColor="#ffffff"
    headerFixedBackgroundColor="#ffffff"
    backgroundScale={1}
    isHeaderFixed
    renderParallaxBackground={() => (
      <ImageBackground
        style={styles.cover}
        source={getImageSource(liturgy)}
      >
        <View style={styles.coverTextContainer}>
          <Text style={styles.coverTitle}>
            {liturgy.title}
          </Text>
          <Text style={styles.coverDescription}>
            {formatLiturgyHeaderDetail(liturgy, items)}
          </Text>
        </View>
      </ImageBackground>
    )}
    parallaxBackgroundScrollSpeed={1}
  >
    <FlatList
      style={styles.container}
      refreshing={refreshing}
      onRefresh={() => refreshLiturgyItems()}
      data={items}
      keyExtractor={item => item.id}
      renderItem={
        ({ item }) => <LiturgyItemListCard style={styles.card} item={item} />
      }
    />
  </ParallaxScroll>
);

LiturgyScreen.propTypes = {
  liturgy: PropTypes.shape(Liturgy.propTypes).isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape(LiturgyItem.propTypes).isRequired,
  ),
  refreshing: PropTypes.bool.isRequired,
  refreshLiturgyItems: PropTypes.func.isRequired,
};

LiturgyScreen.defaultProps = {
  items: [],
};

function mapStateToProps(state, { navigation }) {
  const { state: { params: { liturgy } } } = navigation;
  const { items } = liturgySelector(state, liturgy.id);
  return {
    liturgy,
    items,
    refreshing: (
      apiLoadingSelector(state, 'liturgyItems')
    ),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    refreshLiturgyItems: () => {
      dispatch(
        fetchData({
          resource: 'liturgyItems',
        }),
      );
    },
  };
}

LiturgyScreen.navigationOptions = () => ({
  header: null,
});

export default connect(mapStateToProps, mapDispatchToProps)(LiturgyScreen);
