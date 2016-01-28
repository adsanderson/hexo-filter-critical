'use strict';

var accum = require('accum');

function set (routePath, content, route) {
  return new Promise ((resolve, reject) => {
    route.set(routePath, content);
    resolve();
  });
}

function getString (routePath, route) {

  return new Promise ((resolve, reject) => {
    let htmlRouteStream = route.get(routePath);

    htmlRouteStream
    .pipe(accum.string(function (htmlRouteContent) {
      resolve(htmlRouteContent)
    }));
  });
}

module.exports = {
  getString: getString,
  set: set
};
