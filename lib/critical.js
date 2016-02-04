'use strict';

var tempFiles = require('./tempFiles');
var routeContent = require('./routeContent');

var critical = require('critical').stream;
var minimatch = require('minimatch');
var accum = require('accum');
var vfs = require('vinyl-fs');
var slash = require('slash');

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

    critical.generate({
      base: tempFiles.tmpobj.name,
      src: htmlRoute,
      minify: true,
      inline: true,
      width: 1300,
      height: 900
    })
    .then((content) => {
      console.log('got critical path data');
      routeContent.set(htmlRoute, content, route);
      return;
    })
    .then(resolve)
    .catch((err) => {
      console.log(err);
    });
  });
}

function createCriticalPaths(criticalPathConfig) {
  return function () {
    return criticalPathConfig.htmlRoutes.reduce(function(promise, htmlRoute) {
      return promise.then(function(result) {
        return getCriticalPathContent(htmlRoute, criticalPathConfig.route);
      });
    }, Promise.resolve());
  }
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
