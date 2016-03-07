'use strict';

var tempFiles = require('./tempFiles');
var runCritical = require("runCritical")

var minimatch = require('minimatch');

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

module.exports = function () {
  return new Promise((resolve) => {
    let hexo = this;
    let route  = hexo.route;

    let allHtmlRoutes = htmlSetup(route);
    let mockRoutes = allHtmlRoutes.concat(cssSetup(route));

    tempFiles.create(mockRoutes, route, false)
    .then(runCritical.bind(null, allHtmlRoutes, route))
    .then(tempFiles.clean)
    .then(resolve)
    .catch((err) => {
      console.log(err);
    });
  });
}
