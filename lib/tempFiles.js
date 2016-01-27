'use strict';

var accum = require('accum');
var fs = require('fs');
var path = require('path');

var mkdirp = require('mkdirp');

function getRoutesAndContents (fileRoutes, route) {
  let mockRouteAndContent = createMockRouteAndContent(route);
  return Promise.all(fileRoutes.map((fileRoute) => {
    return mockRouteAndContent(fileRoute);
  }));
}

function createMockRouteAndContent (route) {
  return function(fileRoute) {
    return new Promise((resolve, reject) => {

      let fileRouteDir = path.dirname('temp/' + fileRoute)
      mkdirp.sync(fileRouteDir);

      let fileStream = route.get(fileRoute);
      let dest = fs.createWriteStream('temp/' + fileRoute);

      function streamEnd () {
        resolve();
      }

      fileStream.once('end', streamEnd);

      fileStream
      .pipe(dest);
    });
  }
}

function createTempFiles (fileRoutes, route) {
  return new Promise((resolve, reject) => {
    getRoutesAndContents(fileRoutes, route)
    .then(resolve)
    .catch((err) => {
      console.error(err);
    });
  });
}

function cleanTempFiles () {

}

module.exports = {
  create: createTempFiles,
  clean: cleanTempFiles
}
