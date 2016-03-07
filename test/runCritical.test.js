'use strict';

var test = require('tap').test;
var mock = require('mock-fs');
var runCritical = require("../lib/runCritical");

mock({});

test('runCritical', (t) => {
    runCritical([], {})
    .then((result) => {
      t.equal(result, undefined, 'should not resolve an argument when complete');
      mock.restore();
      t.end();    
    })
    .catch((err) => {
      console.log('error:', err);
      mock.restore();
      t.fail(err);
      t.end();
    });
});