'use strict';

var test = require('tap').test;
var mock = require('mock-fs');
var Readable = require('stream').Readable
var fs = require('fs');

var mockFileRouteStream = new Readable();
var mockHtmlContent = '<html><head></head><body></body></html>';
var tempFiles = require('../lib/tempFiles');

mock({});

function setup () {
  mockFileRouteStream.push(mockHtmlContent);
  mockFileRouteStream.push(null);
}

function createMockRoute () {
  function get () {
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
    let hasFileBeenCreated = fs.statSync(tempFiles.tmpobj.name + '/' + mockFileRoutes[0]).isFile();
    let writtenFileContent = fs.readFileSync(tempFiles.tmpobj.name + '/' + mockFileRoutes[0]).toString();
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
