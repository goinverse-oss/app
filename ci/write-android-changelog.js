#!/usr/bin/env node

const exec = require('child_process').exec;
const { readFile, writeFile } = require('fs').promises;
const util = require('util');

const execPromise = util.promisify(exec);

const remark = require('remark');
const remarkHtml = require('remark-html');

const { readVersion } = require('@brettdh/standard-version-expo/android/native/buildnum/increment');

/* eslint-disable no-console */

function execWithChild(cmd, options) {
  let resolve;
  let reject;
  const done = new Promise((promiseResolve, promiseReject) => {
    resolve = promiseResolve;
    reject = promiseReject;
  });

  const child = exec(cmd, options, (err, stdout, stderr) => {
    if (err) {
      reject(err);
    } else {
      resolve({ stdout, stderr });
    }
  });

  child.done = done;
  return child;
}

(async () => {
  try {
    const versionFile = 'android/app/build.gradle';
    const versionFileContents = await readFile(versionFile, { encoding: 'utf8' });
    const versionCode = readVersion(versionFileContents);
    const filename = `android/fastlane/metadata/android/en-US/changelogs/${versionCode}.txt`;

    // Note: if we don't explicitly close stdin, this hangs
    const child = execWithChild('npm run -s ci:save-latest-changelog', { timeout: 5000 });
    child.stdin.end();
    const { stdout } = await child.done;

    // Trim first line, which contains the version info and github link.
    // It's redundant, since the release notes will also show the version number.
    let changelog = stdout.replace(/[^\n]+\n/, '');
    if (changelog.trim().length === 0) {
      changelog = "Internal improvements and fixes only; (hopefully) nothing you'll notice.";
    }

    const html = await remark().use(remarkHtml).process(changelog);
    await writeFile(filename, html);

    await execPromise(`git add ${filename}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
