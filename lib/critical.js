'use strict';

var tempFiles = require('./tempFiles');

var fs = require('fs');
var critical = require('critical').stream;
var minimatch = require('minimatch');
var through2 = require('through2');
var gs = require('glob-stream');
var File = require('vinyl');
var terminus = require("terminus");

function cssSetup (route) {
  return route.list()
  .filter(function(path) {
    return minimatch(path, '**/*.css', { nocase: true });
  });
}

function htmlSetup(route) {
  return route.list().filter(function(path) {
    return minimatch(path, '**/*.html', { nocase: true });
  });
}

function getCriticalPathContent (htmlRoutes, route) {
  return new Promise((resolve, reject) => {

    function createFile(globFile, enc, cb) {
      console.log('create file', globFile.path);
      globFile.contents = fs.readFileSync(globFile.path);
      let vinylFile = new File(globFile);
      cb(null, vinylFile);
    }

    function setInlineContent (file, enc, cb) {
      console.log('set file to route', file.path);
      let tempPathLen = tempFiles.tmpobj.name.length + 1;
      let fileRoute = file.path.substr(tempPathLen);
      if (htmlRoutes.indexOf(fileRoute) !== -1) {
          route.set(fileRoute, file.contents);
      }
      cb(null, file);
    }

    console.log('start stream');
    var stream = gs.create(`**/*.html`, {cwd: `${tempFiles.tmpobjGlobName}/`});

    stream
    .pipe(through2.obj(createFile))
    .pipe(critical({
      base: tempFiles.tmpobj.name,
      inline: true
    }))
    .pipe(through2.obj(setInlineContent))
    .pipe(terminus.devnull({ objectMode: true }))
    .on('error', (err) => {
      console.log('error: ' + err);
      reject();
    })
    .on('end', () => {
      resolve();
    })
    .on('finish', () => {
      resolve();
    });

  });
}

function createCriticalPaths(criticalPathConfig) {
  return function () {
    return getCriticalPathContent(criticalPathConfig.htmlRoutes, criticalPathConfig.route);
  }
}

function createSetCriticalPaths (route) {
  return function () {
    return setCriticalPaths(route);
  };
}

module.exports = function () {
  return new Promise((resolve, reject) => {
    var hexo = this,
    route  = hexo.route;

    let allHtmlRoutes = htmlSetup(route);
    let mockRoutes = allHtmlRoutes.concat(cssSetup(route));

    let criticalPathConfig = {
      htmlRoutes: allHtmlRoutes,
      route: route
    }
    console.log('Start critical path');
    tempFiles.create(mockRoutes, route, false)
    .then(createCriticalPaths(criticalPathConfig))
    .then(tempFiles.clean)
    .then(resolve)
    .catch((err) => {
      console.log(err);
    });
  });
}
