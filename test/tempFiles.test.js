'use strict';

var test = require('tape');
var mock = require('mock-fs');
var Readable = require('stream').Readable
var fs = require('fs');

var mockFileRouteStream = new Readable();
var mockHtmlContent = '<html><head></head><body></body></html>';

var tempFiles = require('../lib/tempFiles');

function setup () {
  mock({});
  mockFileRouteStream.push(mockHtmlContent);
  mockFileRouteStream.push(null);
}

function createMockRoute () {
  function get (fileRoute) {
    return mockFileRouteStream;
  }
  return {
    get: get
  };
}

test('create temp files', (t) => {

  setup();

  let mockFileRoutes = ['test/index.html'];
  let mockRoute = createMockRoute();

  tempFiles.create(mockFileRoutes, mockRoute)
  .then(() => {
    let hasFileBeenCreated = fs.statSync('temp/' + mockFileRoutes[0]).isFile();
    let writtenFileContent = fs.readFileSync('temp/' + mockFileRoutes[0]).toString();
    mock.restore();
    t.ok(hasFileBeenCreated, 'the temp index html file should be created');
    t.equal(writtenFileContent, mockHtmlContent, 'the content should be the same from teh stream to what is written out to the temp folder');
    t.end();
  })
  .catch((err) => {
    console.log('error:', err);
    mock.restore();
    t.fail(err);
    t.end();
  });

});