'use strict';

var tmp = require('tmp');
var accum = require('accum');
var fs = require('fs');
var path = require('path');
var del = require('rimraf');

var mkdirp = require('mkdirp');

var tmpobj = tmp.dirSync();
var tmpobjGlobName = tmpobj.name.replace(/\\/gi, '/');
tmp.setGracefulCleanup();



function getRoutesAndContents (fileRoutes, route) {
  let mockRouteAndContent = createMockRouteAndContent(route);
  return Promise.all(fileRoutes.map((fileRoute) => {
    return mockRouteAndContent(fileRoute);
  }));
}

function createMockRouteAndContent (route) {
  return function(fileRoute) {
    return new Promise((resolve, reject) => {

      let fileRouteDir = path.dirname(`${tmpobj.name}/${fileRoute}`)
      mkdirp.sync(fileRouteDir);

      let fileStream = route.get(fileRoute);
      let dest = fs.createWriteStream(`${tmpobj.name}/${fileRoute}`);

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
  console.log("Dir: ", tmpobj.name);
  return new Promise((resolve, reject) => {
    return getRoutesAndContents(fileRoutes, route)
    .then(resolve)
    .catch((err) => {
      console.error(err);
    });
  });
}




function cleanTempFiles () {
  // console.log('clean', `${tmpobj.name}/**`);
  // del(tmpobj.name, (deletedPaths) => {
	// console.log(`Deleted files and folders:
  //   ${paths.join('\n')}`);
  // tmpobj.removeCallback();
  // });
  return;
}

module.exports = {
  create: createTempFiles,
  clean: cleanTempFiles,
  tmpobj: tmpobj,
  tmpobjGlobName: tmpobjGlobName
}
