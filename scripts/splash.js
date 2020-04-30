#!/usr/bin/env node

/*
 * Generate splash screen configuration for use with
 * the expo-splash-screen module.
 *
 * Note that this issue still persists, and requires manually
 * generating various splash screen sizes:
 *
 *     https://github.com/expo/expo/issues/4020#issuecomment-619712950
 *
 * We probably don't need a full-screen splash anyway, just the icon
 * with a solid-color background, so this script can go away after we
 * move to that setup.
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
