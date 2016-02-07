'use strict';

var tempFiles = require('./tempFiles');
var routeContent = require('./routeContent');
var fs = require('fs');

var critical = require('critical').stream;
var minimatch = require('minimatch');
var accum = require('accum');

var through2 = require('through2');
var gs = require('glob-stream');
var File = require('vinyl');


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

function getCriticalPathContent (htmlRoute, route) {
  return new Promise((resolve, reject) => {
    console.log('start 2');


    var map = require('map-stream');

    var log = function(file, cb) {
      console.log(file.path);
      cb(null, file);
    };

    function createFile(globFile, enc, cb) {
      function readFile (globPath) {
        return fs.readFileSync(globPath);
      }
      globfile.content = readFile();
      cb(null, new File(globFile));
    }

    var stream = gs.create(`**/*.html`, {cwd: `${tempFiles.tmpobjGlobName}/`});

    stream
    // .pipe(map(log))
    .pipe(through2.obj(createFile))
    .pipe(critical({
      base: tempFiles.tmpobj.name,
      inline: true
    }))
    .on('error', (err) => {
      console.log('error: ' + err);
      reject();
    })
    .on('end', () => {
      console.log('end');
      resolve();
    })
    .on('finish', () => {
      console.log('finished');
      resolve();
    });

  });
}

function createCriticalPaths(criticalPathConfig) {
  return function () {
    return getCriticalPathContent(undefined, criticalPathConfig.route);
    // return criticalPathConfig.htmlRoutes.reduce(function(promise, htmlRoute) {
    //   return promise.then(function(result) {
    //     return getCriticalPathContent(htmlRoute, criticalPathConfig.route);
    //   });
    // }, Promise.resolve());
  }
}

// function setCriticalPaths (route) {
//   return new Promise(resolve, reject) {
//
//   }
// }

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

    tempFiles.create(mockRoutes, route, false)
    .then(createCriticalPaths(criticalPathConfig))
    .then(tempFiles.clean)
    .then(resolve)
    .catch((err) => {
      console.log(err);
    });
  });
}
