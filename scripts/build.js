#!/usr/bin/env node

/*
 * Run a release build with fastlane, setting the release channel
 * from the command line arguments and perhaps also publishing to Expo.
 */

const fs = require('fs');
const { spawn } = require('child_process');

const yargs = require('yargs');
const plist = require('plist');
const xml2js = require('xml2js');


function build(platform, { uploadBeta }) {
  const cmd = 'bundle';
  let lane;
  if (uploadBeta) {
    lane = 'beta';
  } else {
    lane = 'build';
  }
  const args = ['exec', 'fastlane', lane];
  console.log(`Running '${cmd} ${args.join(' ')}'`);
  const proc = spawn(cmd, args, { cwd: platform, stdio: 'inherit' });

  process.on('SIGINT', () => proc.kill('SIGINT'));

  return new Promise((resolve, reject) => {
    proc.on('error', error => reject(error));
    proc.on('exit', (code) => {
      if (code !== 0) {
        reject(new Error(`fastlane build exited with code ${code}`));
      } else {
        resolve();
      }
    });
  });
}

async function main(argv) {
  const platform = argv._[0];

  let configFile;
  let config;
  if (platform === 'ios') {
    configFile = 'ios/the-liturgists/Supporting/Expo.plist';

    const plistText = await fs.promises.readFile(configFile, 'utf-8');
    const plistObj = plist.parse(plistText);
    plistObj.EXUpdatesReleaseChannel = argv.releaseChannel;
    config = plist.build(plistObj);
  } else if (platform === 'android') {
    configFile = 'android/app/src/main/AndroidManifest.xml';

    const manifestText = await fs.promises.readFile(configFile, 'utf-8');
    const manifestObj = await xml2js.parseStringPromise(manifestText);
    manifestObj.manifest.application[0]['meta-data'].push(
      {
        $: {
          'android:name': 'expo.modules.updates.EXPO_RELEASE_CHANNEL',
          'android:value': argv.releaseChannel,
        },
      },
    );
    config = new xml2js.Builder({ headless: true }).buildObject(manifestObj);
  } else {
    throw new Error(`Unknown platform ${platform}`);
  }

  // 1) Back up existing file
  const backupConfigFile = `${configFile}.bak`;
  console.log(`Backing up ${configFile}`);
  await fs.promises.rename(configFile, backupConfigFile);

  async function restoreConfig() {
    console.log(`Restoring original ${configFile}`);
    await fs.promises.rename(backupConfigFile, configFile);
  }

  // ignore interrupt; build will bail out
  process.on('SIGINT', () => {});

  try {
    // 2) Write file with new value for release channel
    await fs.promises.writeFile(configFile, config);

    // 3) Run build
    await build(platform, argv);
  } finally {
    // 4) Restore old config file
    await restoreConfig();
  }
}

const argv = yargs
  .option('release-channel', {
    default: 'default',
    describe: 'Expo release channel to build into the app',
  })
  .option('upload-beta', {
    boolean: true,
    describe: 'Build beta release and publish to testing service',
  })
  .command('ios', 'build ios app')
  .command('android', 'build android app')
  .version(false)
  .help()
  .argv;

main(argv)
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
