import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Button,
  Alert,
} from 'react-native';
import * as Updates from 'expo-updates';

import appStyles from '../styles';

const styles = StyleSheet.create({
  container: {
    padding: 10,
    alignItems: 'center',
  },
  header: {
    fontSize: 18,
    fontWeight: '700',
  },
});

function formatDate(d) {
  return d ? `${d.toDateString()} ${d.toLocaleTimeString()}` : 'Checking...';
}

const AboutScreen = () => {
  const [lastUpdateCheck, setLastUpdateCheck] = useState(null);
  const [updateResult, setUpdateResult] = useState(null);
  const [updating, setUpdating] = useState(false);

  function checkForUpdates() {
    if (updateResult !== null) {
      setUpdateResult(null);
    }
    Updates.checkForUpdateAsync()
      .then((result) => {
        setUpdateResult(result);
        setLastUpdateCheck(new Date());
      })
      .catch((e) => {
        Alert.alert(
          'Error checking for updates',
          e.message,
        );
        setUpdateResult(e);
        setLastUpdateCheck(new Date());
      });
  }

  function loadUpdate() {
    setUpdating(true);
    Updates.fetchUpdateAsync()
      .then((result) => {
        if (result.isNew) {
          Updates.reloadAsync();
        }
      })
      .catch((e) => {
        Alert.alert(
          'Error loading update',
          e.message,
        );
      });
  }

  useEffect(() => {
    if (lastUpdateCheck === null) {
      checkForUpdates();
    }
  }, []);

  let updateSummary;
  if (updateResult === null) {
    updateSummary = 'Checking for update...';
  } else if (updateResult instanceof Error) {
    updateSummary = 'Error checking for updates';
  } else if (updateResult.isAvailable) {
    updateSummary = `Update available: ${updateResult.manifest.revisionId}`;
  } else {
    updateSummary = 'No updates available';
  }

  return (
    <View style={appStyles.container}>
      <Text style={styles.header}>The Liturgists</Text>
      <Text>{`Version: ${Updates.manifest.version}`}</Text>
      <Text>{`Revision ID: ${Updates.manifest.revisionId}`}</Text>
      <Text>{`Release channel: ${Updates.releaseChannel}`}</Text>
      <Text>{`Update ID: ${Updates.updateId}`}</Text>
      <Text>{updateSummary}</Text>
      <Text>{`Last update check: ${formatDate(lastUpdateCheck)}`}</Text>
      {
        lastUpdateCheck && (
          <Button
            title="Check for Updates"
            disabled={updateResult === null}
            onPress={checkForUpdates}
          />
        )
      }
      {
        updateResult?.isAvailable && (
          <Button
            title={updating ? 'Updating...' : 'Update'}
            disabled={updating}
            onPress={loadUpdate}
          />
        )
      }
    </View>
  );
};

export default AboutScreen;
