#!/usr/bin/env node

/*
 * Generate splash screen configuration for use with
 * the expo-splash-screen module.
 */

const { execFile } = require('child_process');

const app = require('../app.json');

const { image, backgroundColor, resizeMode } = app.expo.splash;
const cmd = 'expo-splash-screen';
const args = [
  `--resize-mode=${resizeMode}`,
  backgroundColor,
  image,
];
console.log(`Executing: ${cmd} ${args.join(' ')}`);
execFile(cmd, args, (error, stdout, stderr) => {
  console.error(stderr);
  console.log(stdout);
  if (error) {
    process.exit(error.code);
  }
});
