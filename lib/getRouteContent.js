'use strict';

var accum = require('accum');



module.exports = function (htmlRoute, route) {

  return new Promise ((resolve, reject) => {
    let htmlRouteStream = route.get(htmlRoute);

    htmlRouteStream
    .pipe(accum.string(function (htmlRouteContent) {
      resolve(htmlRouteContent)
    }));
  });
}
