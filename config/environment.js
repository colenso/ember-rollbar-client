/* eslint-env node */
'use strict';

function codeVersion() {
  // Heroku Git Hash support
  if (process.env.SOURCE_VERSION) {
    let packageJson = require('../package.json');
    let gitHash = process.env.SOURCE_VERSION.substr(0, 7);

    return `${packageJson.version}+${gitHash}`;
  } else {
    let gitRepoVersion = require('git-repo-version');

    return gitRepoVersion({ shaLength: 7 });
  }
}

module.exports = function(environment, appConfig) {
  appConfig.emberRollbarClient = {
    enabled: environment !== 'test' && environment !== 'development',
    accessToken: '',
    verbose: true,
    captureUncaught: environment !== 'test',
    captureUnhandledRejections: environment !== 'test',
    payload: {
      environment: environment,
      client: {
        javascript: {
          source_map_enabled: true,
          code_version: codeVersion(), // returns app version in format: 2.4.0+06df23a
          // Optionally have Rollbar guess which frames the error was thrown from
          // when the browser does not provide line and column numbers.
          guess_uncaught_frames: true
        }
      }
    }
  }
};
