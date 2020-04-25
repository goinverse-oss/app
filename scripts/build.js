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

  await build(platform, argv);
}

const argv = yargs
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
