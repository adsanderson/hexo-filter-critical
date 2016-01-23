'use strict';

var mock = require('mock-fs');
var accum = require('accum');

function getRoutesAndContents (fileRoutes, route) {
  let mockRouteAndContent = createMockRouteAndContent(route);
  return Promise.all(fileRoutes.map((fileRoute) => {
    console.log
    return mockRouteAndContent(fileRoute);
  }));
}

function createMockRouteAndContent (route) {
  return function(fileRoute) {
    return new Promise((resolve, reject) => {
      route.get(fileRoute)
      .pipe(accum.string(function (content) {
        resolve({
          fileRoute: 'public/' + fileRoute,
          content: content
        });
      }));
    });
  }
}

function reduceRoutesToMockConfig (fileRoutesAndContents) {
  return fileRoutesAndContents.reduce((mockConfig, fileRouteAndContent) => {
    mockConfig[fileRouteAndContent.fileRoute] = fileRouteAndContent.content;
    return mockConfig;
  }, {});
}

function createMockFS (mockConfig) {
  mock(mockConfig);
}

module.exports = function mockFiles (fileRoutes, route) {
  return new Promise((resolve, reject) => {
    getRoutesAndContents(fileRoutes, route)
    .then(reduceRoutesToMockConfig)
    .then(createMockFS)
    .then(resolve)
    .catch((err) => {
      console.log('??????????????????????????????????', err);
    });
  });
}
