/* jshint expr:true */
var CoreObject   = require('core-object');
var path   = require('path');
var RSVP   = require('rsvp');
var resolve = RSVP.denodeify(require('resolve'));
var fs = require('fs-extra');
var npmHelpers = require('./npm-helpers');

module.exports = CoreObject.extend({
  project: {
    root: ''
  },

  changeTo: function() {
    var manager = this;
    var packageFile = path.join(manager.project.root, 'package.json');
    return npmHelpers.resetPackageFile(manager.project.root).then(function() {
      var packageJSON = JSON.parse(fs.readFileSync(packageFile));
      fs.writeFileSync(packageFile, JSON.stringify(manager._packageJSONForTest(packageJSON), null, 2));
      return npmHelpers.install(manager.project.root);

    });
  },

  _packageJSONForTest: function(packageJSON) {
    var scenario = {
      dependencies: {
        "ember-deploy-redis": "0.0.6",
      },
      devDependencies: {
        "redis": "^0.12.1",
        "then-redis": "^1.3.0"
      }
    };
    var pkgs = Object.keys(scenario.devDependencies);
    pkgs.forEach(function(pkg){
      packageJSON.devDependencies[pkg] = scenario.devDependencies[pkg];
    });
    pkgs = Object.keys(scenario.dependencies);
    pkgs.forEach(function(pkg){
      packageJSON.dependencies[pkg] = scenario.dependencies[pkg];
    });
    return packageJSON;
  }
});
