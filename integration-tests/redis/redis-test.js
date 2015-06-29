/* jshint expr:true */
var fs = require('fs-extra');
var syncExec = require('sync-exec');
var expect = require('chai').expect;
var DepsManager = require('../utils/deps-manager.js');
var npmHelpers = require('../utils/npm-helpers.js');
var redis = require('then-redis');

var resetRedis = function () {
  var client = redis.createClient({ host: 'localhost', port: 6379 });

  return client.lrange('ember-cli-deploy', 0, 10).then(function (k) {
    return client.del.apply(client, k);
  });
};

var verifyUpload = function () {
  var client = redis.createClient({ host: 'localhost', port: 6379 });
  return client.lrange('ember-cli-deploy', 0, 100).then(function (k) {
    return client.get(k[0]);
  }).then(function (v) {
    var indexContents = fs.readFileSync('dist/index.html');
    expect(v).to.equal(indexContents.toString());
  });
};

describe('uploading the index', function () {
  it('stores the index in redis', function (done) {
    this.timeout(30 * 1000);
    resetRedis().then(function () {
      var config = '--deploy-config-file node-tests/fixtures/config/ember-deploy-redis.js';
      var command = "LOAD_ADAPTERS=ember-deploy-redis EMBER_VERBOSE_ERRORS=true " +
        "ember deploy " + config + " --environment test";
      var commandResult = syncExec(command);
      expect(commandResult.stderr).to.equal('');

      verifyUpload().then(done, done);
    });
  });
});


describe('fake', function() {
  it('fakes', function() {
    expect(true).to.eq(true);
  });
});
