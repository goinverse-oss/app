import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Animated, FlatList, ImageBackground, ScrollView, Text, View, StyleSheet } from 'react-native';
import Constants from 'expo-constants';

import BackButton from '../navigation/BackButton';
import LiturgyItemListCard from '../components/LiturgyItemListCard';
import LiturgyItem from '../state/models/LiturgyItem';
import Liturgy from '../state/models/Liturgy';
import { formatLiturgyDescription } from '../components/LiturgySeriesTile';
import { liturgySelector, apiLoadingSelector } from '../state/ducks/orm/selectors';
import { fetchData } from '../state/ducks/orm';
import { screenRelativeWidth } from '../components/utils';
import { getImageSource } from '../state/ducks/orm/utils';
import appPropTypes from '../propTypes';


const coverImageWidth = screenRelativeWidth(1.0);
const coverImageHeight = coverImageWidth;
const navHeaderHeight = 44;
const headerHeight = navHeaderHeight + Constants.statusBarHeight;
const overlap = 100;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 7,
    marginTop: -overlap,
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
    marginTop: -navHeaderHeight,
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
  return animatedValue ? animatedValue.interpolate({
    inputRange: [0, coverImageHeight - navHeaderHeight - overlap],
    outputRange,
  }) : outputRange[0];
}

const Title = ({ liturgy, animatedValue }) => (
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
);

Title.propTypes = {
  liturgy: PropTypes.shape(Liturgy.propTypes).isRequired,
  animatedValue: PropTypes.instanceOf(Animated.Value),
};

Title.defaultProps = {
  animatedValue: null,
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
class LiturgyScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      scrollY: new Animated.Value(0),
    };
  }

  componentDidMount() {
    const { scrollY } = this.state;
    this.props.navigation.setParams({ scrollY });
  }

  render() {
    const {
      liturgy,
      items,
      refreshing,
      refreshLiturgyItems,
    } = this.props;

    return (
      <ScrollView
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: {
                  y: this.state.scrollY,
                },
              },
            },
          ],
        )}
      >
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
      </ScrollView>
    );
  }
}

LiturgyScreen.propTypes = {
  liturgy: PropTypes.shape(Liturgy.propTypes).isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape(LiturgyItem.propTypes).isRequired,
  ),
  navigation: appPropTypes.navigation.isRequired,
  refreshing: PropTypes.bool.isRequired,
  refreshLiturgyItems: PropTypes.func.isRequired,
};

LiturgyScreen.defaultProps = {
  items: [],
};

function mapStateToProps(state, { route }) {
  const { params: { liturgy } } = route;
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

export const getLiturgyScreenOptions = ({ route }) => ({
  headerLeft: () => <BackButton />,
  headerTitle: () => (
    <Title
      liturgy={route.params.liturgy}
      animatedValue={route.params.scrollY}
    />
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(LiturgyScreen);
