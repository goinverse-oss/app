import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import moment from 'moment';
import { Easing, ViewPropTypes, View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { connect } from 'react-redux';
import momentPropTypes from 'react-moment-proptypes';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Progress from 'react-native-progress';
import TextTicker from 'react-native-text-ticker';
import axios from 'axios';
import { Linking } from 'expo';

import PlayButton from './PlayButton';
import SquareImage from './SquareImage';
import InteractionsCounter from './InteractionsCounter';
import {
  formatFooter,
  formatMinutesString,
  formatHumanizeFromNow,
  screenRelativeWidth,
} from './utils';

import config from '../../config.json';
import AppPropTypes from '../propTypes';
import { getImageSource } from '../state/ducks/orm/utils';
import * as storageActions from '../state/ducks/storage/actions';
import * as storageSelectors from '../state/ducks/storage/selectors';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  imageContainer: {
    width: '30%',
    marginRight: 28,
  },
  metadataContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  times: {
    fontSize: 12,
    color: '#797979',
  },
  interactionsCounterContainer: {
    minHeight: 25,
  },
  interactionsCounter: {
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  downloadButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  downloadIcon: {
    fontSize: 36,
  },
  deleteIcon: {
    fontSize: 36,
  },
  progressIcon: {
    fontSize: 36,
  },
  progressIndicator: {
    position: 'absolute',
    bottom: 12.5,
  },
});

function progressFraction(progress) {
  if (!progress) {
    return 0.0;
  }

  const { totalBytesWritten, totalBytesExpectedToWrite } = progress;
  return totalBytesWritten / totalBytesExpectedToWrite;
}

const DownloadButton = ({ isDownloaded, downloadProgress, onPress }) => {
  const actionIcon = (
    isDownloaded
      ? <Ionicons name="md-cloud-done" style={styles.deleteIcon} />
      : <Ionicons name="md-cloud-download" style={styles.downloadIcon} />
  );
  const progressIcon = (
    <Ionicons name="md-cloud" style={styles.progressIcon} />
  );
  const icon = downloadProgress ? progressIcon : actionIcon;
  const disabled = (downloadProgress !== null);
  const progressValue = progressFraction(downloadProgress);
  const progress = downloadProgress ? (
    <Progress.Pie
      style={styles.progressIndicator}
      progress={progressValue}
      size={15}
      color="white"
    />
  ) : null;
  return (
    <TouchableWithoutFeedback
      onPress={onPress}
      disabled={disabled}
      accessible
      accessibilityLabel={isDownloaded ? 'Delete download' : 'Download'}
      accessibilityRole="button"
    >
      <View style={styles.downloadButton}>
        {icon}
        {progress}
      </View>
    </TouchableWithoutFeedback>
  );
};

DownloadButton.propTypes = {
  isDownloaded: PropTypes.bool.isRequired,
  downloadProgress: PropTypes.shape({
    totalBytesWritten: PropTypes.number.isRequired,
    totalBytesExpectedToWrite: PropTypes.number.isRequired,
  }),
  onPress: PropTypes.func.isRequired,
};

DownloadButton.defaultProps = {
  downloadProgress: null,
};

function fetchDiscourseInfo(item) {
  const topicId = item.discourseTopicUrl.split('/').slice(-1)[0];
  const url = `${config.apiBaseUrl}/discourse/counts/${topicId}`;
  return axios.get(url).then(r => _.pick(r.data, ['like_count', 'posts_count']));
}

const PlayableItemHeader = ({
  item,
  style,
  elapsed,
  isDownloaded,
  downloadProgress,
  onPlay,
  startDownload,
  removeDownload,
  formatDuration,
  formatPublishedAt,
  ...props
}) => {
  const pendingDiscourseInfo = {
    likes: null,
    comments: null,
  };
  const [discourseInfo, setDiscourseInfo] = useState(pendingDiscourseInfo);

  useEffect(() => {
    if (item.discourseTopicUrl) {
      setDiscourseInfo(pendingDiscourseInfo);
      fetchDiscourseInfo(item).then(info => setDiscourseInfo(info));
    }
  }, [item.discourseTopicUrl]);

  const { like_count: likes, posts_count: comments } = discourseInfo;

  return (
    <View style={[styles.container, style]} {...props}>
      <View style={styles.imageContainer}>
        <SquareImage
          source={getImageSource(item)}
          width={screenRelativeWidth(0.3)}
        />
      </View>
      <View style={styles.metadataContainer}>
        <TextTicker
          style={styles.title}
          scrollSpeed={25}
          marqueeDelay={2000}
          easing={Easing.linear}
        >
          {item.title}
        </TextTicker>
        <Text style={styles.times}>
          {formatFooter({
            duration: item.duration,
            elapsed,
            publishedAt: item.publishedAt,
            formatDuration,
            formatPublishedAt,
          })}
        </Text>
        <View style={styles.interactionsCounterContainer}>
          {
            item.discourseTopicUrl ? (
              <InteractionsCounter
                style={styles.interactionsCounter}
                likes={likes}
                comments={comments}
                onPress={() => {
                  Linking.openURL(item.discourseTopicUrl);
                }}
              />
            ) : null
          }
        </View>
        <View style={styles.actionsContainer}>
          <PlayButton onPress={onPlay} text="Listen" />
          <DownloadButton
            isDownloaded={isDownloaded}
            downloadProgress={downloadProgress}
            onPress={isDownloaded ? removeDownload : startDownload}
          />
        </View>
      </View>
    </View>
  );
};

PlayableItemHeader.propTypes = {
  item: AppPropTypes.mediaItem.isRequired,
  style: ViewPropTypes.style,
  elapsed: momentPropTypes.momentDurationObj,
  onPlay: PropTypes.func,
  formatDuration: PropTypes.func,
  formatPublishedAt: PropTypes.func,
};

PlayableItemHeader.defaultProps = {
  style: {},
  elapsed: moment.duration(),
  onPlay: () => {},
  formatDuration: formatMinutesString,
  formatPublishedAt: formatHumanizeFromNow,
};

function mapStateToProps(state, { item }) {
  return {
    isDownloaded: !!storageSelectors.getDownloadPath(state, item),
    downloadProgress: storageSelectors.getDownloadProgress(state, item),
  };
}

function mapDispatchToProps(dispatch, { item }) {
  return {
    startDownload: () => {
      dispatch(storageActions.startDownload(item));
    },
    removeDownload: () => {
      dispatch(storageActions.removeDownload(item));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PlayableItemHeader);
