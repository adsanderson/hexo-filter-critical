'use strict';

var tempFiles = require('./tempFiles');
var inlineCSS = require('./inlineCSS');
var getRouteContent = require('./getRouteContent');

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
    console.log('test')
    let test = function (htmlRouteContent) {
      console.log('second test', htmlRouteContent);
      return inlineCSS(htmlRouteContent, criticalCSS);
    }

    getRouteContent(htmlRoutes[0], route)
    .then(test);
  }
}

module.exports = function () {
  return new Promise((resolve, reject) => {
    var hexo = this,
    route  = hexo.route;


    let allHtmlRoutes = htmlSetup(route);
    let defaultHtmlRoutes = ['index.html'];

    // let tempRoutes = defaultHtmlRoutes;
    // let criticalRoute = defaultHtmlRoutes;
    //
    // if (createAllRoutes) {
    //   let tempRoutes = defaultHtmlRoutes;
    //   let criticalRoute = defaultHtmlRout
    // }

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
