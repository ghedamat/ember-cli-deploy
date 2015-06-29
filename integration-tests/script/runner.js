/* jshint expr:true */
var fs = require('fs-extra');
var syncExec = require('sync-exec');
var expect = require('chai').expect;
var DepsManager = require('../utils/deps-manager.js');
var npmHelpers = require('../utils/npm-helpers.js');
var run = require('../utils/run.js');

var root = '/Users/tha/Dev/VAR/ember-cli-deploy';
var manager = new DepsManager({
  project: {
    root: root
  }
});

npmHelpers.backupPackageFile(root)
.then(function() {
  return manager.changeTo();
}).then(function() {
  console.log('package json changed');
  return run('npm', ['run-script', 'integration-test'], {cwd: root});
}).finally(function() {
  return npmHelpers.cleanup(root);
});
