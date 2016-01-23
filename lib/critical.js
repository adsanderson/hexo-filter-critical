'use strict';

var critical = require('critical');
var minimatch = require('minimatch');
var mock = require('mock-fs');
var accum = require('accum');

function createCSSRoutes (cssRoutes, route) {
  let mockCSSRoute = createMockCSSLocations(route);
  return Promise.all(cssRoutes.map((cssRoute) => {
    return mockCSSRoute(cssRoute);
  }));
}

function createMockCSSLocations (route) {
  return function(cssRoute) {
    return new Promise((resolve, reject) => {
      route.get(cssRoute)
      .pipe(accum.string(function (content) {
        resolve({
          cssRoute: cssRoute,
          content: content
        });
      }));
    });
  }
}

function createMockCSS (cssMockConfig) {
  mock(cssMockConfig);
}

function cssSetup (route) {

  let cssRoutes = route.list()
  .filter(function(path) {
    return minimatch(path, '**/*.css', { nocase: true });
  })

  return new Promise((resolve, reject) => {
    createCSSRoutes(cssRoutes, route)
    .then((results) => {
      return results.reduce((mockCSS, css) => {
        mockCSS[css.cssRoute] = css.content;
        return mockCSS;
      }, {});
    })
    .then(createMockCSS)
    .then(resolve);
  });
}

function htmlSetup(route) {

}

// function testStream(path, route) {
//   debugger
//   var test = route.get(path);
//
//     console.log(path)
//
//     critical.generate({
//       base: 'public/',
//       src: path,
//       css: ['public/css/style.css'],
//       width: 1300,
//       height: 900
//     }, function (err, output) {
//       console.log(err, output);
//       // You now have critical-path CSS
//       // Works with and without dest specified
//     });
//
// }

module.exports = function () {
  return new Promise((resolve, reject) => {
    var hexo = this,
    route  = hexo.route;

    var routes = route.list().filter(function(path) {
      return minimatch(path, '**/*.html', { nocase: true });
    });



    cssSetup(route)
    .then(mock.restore)
    .then(resolve);
  });
}
