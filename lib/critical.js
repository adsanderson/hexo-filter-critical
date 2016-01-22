'use strict';

var critical = require('critical');
var minimatch = require('minimatch');
var mock = require('mock-fs');
var accum = require('accum');

function routeStreamToString () {

}

function logRoute (cssRoute) {
  console.log(cssRoute);
  return Promise.resolve();
}

function createCSSRoutes (cssRoutes) {
  return Promise.all(cssRoutes.map((cssRoute) => {
    return logRoute(cssRoute);
  }));
}

function createMockCSSLocations (route) {
  return function(filePath) {
    return new Promise((resolve, reject) => {
      route.get(filePath)
      .pipe(accum.string(function (content) {
        console.log(1);
        // mockCSS[filePath] = content;
        resolve(content);
      }));
    });
  }
}

function testStream(path, route) {
  debugger
  var test = route.get(path);
    // .pipe(critical({
    //   width: 1300,
    //   height: 900
    // }));

    console.log(path)

    critical.generate({
      base: 'public/',
      src: path,
      css: ['public/css/style.css'],
      width: 1300,
      height: 900
    }, function (err, output) {
      console.log(err, output);
      // You now have critical-path CSS
      // Works with and without dest specified
    });


}

module.exports = function () {
  return new Promise((resolve, reject) => {
    var hexo = this,
    route  = hexo.route;

    let mockCSSLocations = createMockCSSLocations(route);

    var routes = route.list().filter(function(path) {
      return minimatch(path, '**/*.html', { nocase: true });
    });

    var cssRoutes = route.list()
    .filter(function(path) {
      return minimatch(path, '**/*.css', { nocase: true });
    })

    createCSSRoutes(cssRoutes)
    .then(() => {
      console.log(3);
      resolve();
    });
  });
}
