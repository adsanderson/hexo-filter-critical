'use strict';

var tmp = require('tmp');
const osTmpdir = require('os-tmpdir');
var fs = require('fs');
var path = require('path');
var del = require('del');
var slash = require('slash');

var mkdirp = require('mkdirp');

var tmpobj = tmp.dirSync();
var tmpobjGlobName = slash(tmpobj.name);
tmp.setGracefulCleanup();

function getRoutesAndContents (fileRoutes, route) {
  let mockRouteAndContent = createMockRouteAndContent(route);
  return Promise.all(fileRoutes.map((fileRoute) => {
    return mockRouteAndContent(fileRoute);
  }));
}

function createMockRouteAndContent (route) {
  return function(fileRoute) {
    return new Promise((resolve) => {

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
  return new Promise((resolve) => {
    return getRoutesAndContents(fileRoutes, route)
    .then(resolve)
    .catch((err) => {
      console.error(err);
    });
  });
}

function cleanTempFiles () {
  return new Promise((resolve) => {

    let tmpdir = slash(osTmpdir());
    let tmpobjDirName = tmpobjGlobName.substr(tmpdir.length + 1);
    let delOpts = {
      // dryRun: true,
      cwd: tmpdir
    };


    del([`${tmpobjDirName}/**`], delOpts)
    .then(() => {
      resolve();
    })
    .catch((err) => {
      console.log('err', err);
    })

  });

}

module.exports = {
  create: createTempFiles,
  clean: cleanTempFiles,
  tmpobj: tmpobj,
  tmpobjGlobName: tmpobjGlobName
}
