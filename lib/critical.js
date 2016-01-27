'use strict';

var tempFiles = require('./tempFiles');
var inlineCSS = require('./inlineCSS');
var routeContent = require('./routeContent');

var critical = require('critical');
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

function getCriticalPathContent (htmlRoute) {
  return new Promise((resolve, reject) => {
    critical.generate({
      base: 'temp/',
      src: htmlRoute,
      css: ['//fonts.googleapis.com/css?family=Source+Code+Pro|Merriweather+Sans:300']
      minify: true,
      width: 1300,
      height: 500
    })
    .then((content) => {
      //console.log(content)
      console.log('got CP data');
      return content;
    })
    .then(resolve)
    .catch((err) => {
      console.log(err);
    });
  });
}

function createCriticalPaths (htmlRoutes) {
  return function () {
    return Promise.all(htmlRoutes.map(getCriticalPathContent));
  }
}

function createInlineCSS (htmlRoutes, route) {
  return function (criticalCSS) {

    let updateContent = function (htmlRouteContent) {
      return inlineCSS(htmlRouteContent, criticalCSS[0]);
      console.log('Do I reach here?');
    }

    let setContent = function (newContent) {
      return routeContent.set(htmlRoutes[0], newContent, route);
    }
    console.log(htmlRoutes[0]);
    return routeContent.getString(htmlRoutes[0], route)
    .then(updateContent)
    .then(setContent);
  }
}

module.exports = function () {
  return new Promise((resolve, reject) => {
    var hexo = this,
    route  = hexo.route;

    let allHtmlRoutes = htmlSetup(route);
    let defaultHtmlRoutes = ['index.html'];

    let mockRoutes = defaultHtmlRoutes.concat(cssSetup(route));

    tempFiles.create(mockRoutes, route, false)
    .then(createCriticalPaths(defaultHtmlRoutes))
    .then(createInlineCSS(allHtmlRoutes, route))
    .then(resolve)
    .catch((err) => {
      console.log(err);
    });
  });
}
