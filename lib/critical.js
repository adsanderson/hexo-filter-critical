'use strict';

var mockFiles = require('./mockFiles');

var critical = require('critical');
var minimatch = require('minimatch');
var mock = require('mock-fs');
var accum = require('accum');



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

function createCriticalPaths (htmlRoutes) {
  return function () {
    return new Promise((resolve, reject) => {
      critical.generate({
        base: 'public/',
        src: htmlRoutes[1],
        width: 1300,
        height: 500
      })
      .then((content) => {
        console.log(content)
      })
      .then(resolve)
      .catch((err) => {
        console.log(err);
      });
    });
  }
}

module.exports = function () {
  return new Promise((resolve, reject) => {
    var hexo = this,
    route  = hexo.route;


    let htmlRoutes = htmlSetup(route);
    let mockRoutes = htmlRoutes.concat(cssSetup(route));

    mockFiles(mockRoutes, route)
    .then(createCriticalPaths(htmlRoutes))
    .then(mock.restore)
    .then(resolve)
    .catch((err) => {
      console.log(err);
    });
  });
}
