import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
} from 'react-native';
import { connect } from 'react-redux';

import { withNavigation } from '@react-navigation/compat';
import * as WebBrowser from 'expo-web-browser';
import HTML from 'react-native-render-html';

import Collapsible from 'react-native-collapsible';
import Icon from '@expo/vector-icons/MaterialIcons';

import { screenRelativeWidth, screenRelativeHeight } from '../components/utils';
import * as selectors from '../state/ducks/patreon/selectors';
import appPropTypes from '../propTypes';

const styles = StyleSheet.create({
  description: {
    padding: 20,
  },
  item: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  button: {
    width: screenRelativeWidth(0.7),
    height: screenRelativeHeight(0.1),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#034536',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    textTransform: 'uppercase',
  },
  infoButton: {
    position: 'absolute',
    right: 20,
  },
  infoIcon: {
    fontSize: 24,
    color: '#fff',
  },
});

function tidyDescription(s) {
  if (typeof s === 'string') {
    return s.trim().replace(/^ +/gm, '').replace(/([^\n])\n([^\n])/g, '$1 $2');
  }
  return s;
}

const CommunityItem = ({
  selected,
  title,
  description,
  onSelect,
  navigation,
  isPatron,
  patronsOnly,
  navRoute,
  url,
}) => {
  function onPress() {
    if (patronsOnly && !isPatron) {
      navigation.navigate('Patreon');
      return;
    }
    if (url) {
      WebBrowser.openBrowserAsync(url);
    } else if (navRoute) {
      navigation.navigate(navRoute);
    }
  }

  return (
    <View style={styles.item}>
      <TouchableWithoutFeedback onPress={onPress}>
        <View style={styles.button} >
          <Text style={styles.buttonText}>{title}</Text>
          {
            onSelect && (
              <TouchableWithoutFeedback onPress={onSelect}>
                <View style={styles.infoButton}>
                  <Icon name="info-outline" style={styles.infoIcon} />
                </View>
              </TouchableWithoutFeedback>
            )
          }
        </View>
      </TouchableWithoutFeedback>
      <Collapsible collapsed={!selected} fixedHeight>
        <View style={styles.descriptionContainer}>
          <HTML
            containerStyle={styles.description}
            html={tidyDescription(description)}
            onLinkPress={(evt, href) => WebBrowser.openBrowserAsync(href)}
          />
        </View>
      </Collapsible>
    </View>
  );
};

CommunityItem.propTypes = {
  navigation: appPropTypes.navigation.isRequired,
  selected: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
  ]).isRequired,
  navRoute: PropTypes.string,
  url: PropTypes.string,
  patronsOnly: PropTypes.bool,
  isPatron: PropTypes.bool,
  onSelect: PropTypes.func,
};

CommunityItem.defaultProps = {
  patronsOnly: false,
  isPatron: false,
  navRoute: null,
  url: null,
  onSelect: null,
};

function mapStateToProps(state) {
  return {
    isPatron: selectors.isPatron(state),
  };
}

export default withNavigation(
  connect(mapStateToProps)(CommunityItem),
);
