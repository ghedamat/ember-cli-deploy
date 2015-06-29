var fs = require('fs-extra');
var path   = require('path');
var RSVP   = require('rsvp');
var run = require('./run');
var rimraf = RSVP.denodeify(require('rimraf'));
var resolve = RSVP.denodeify(require('resolve'));

module.exports = npmHelpers = {
  backupPackageFile: function(root){
    var copy = RSVP.denodeify(fs.copy);
    return copy('package.json', 'package.json.ember-try', {cwd: root});
  },
  resetPackageFile: function(root) {
    var copy = RSVP.denodeify(fs.copy);
    return copy('package.json.ember-try', 'package.json', {cwd: root});
  },
  install: function(root) {
    return rimraf(path.join(root, 'node_modules')).then(function() {
      return run('npm', ['install', '--config.interactive=false'], {cwd: root});
    });
  },
  cleanup: function(root){
    var helpers = this;
    return helpers.resetPackageFile(root).then(function(){
      return rimraf(path.join(root, 'package.json.ember-try'));
    })
    .catch(function(){})
    .then(function(){
      return helpers.install(root);
    });
  },
};
