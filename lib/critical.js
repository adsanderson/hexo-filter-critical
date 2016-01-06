'use strict';

var critical = require('critical').stream;
var minimatch = require('minimatch');

function testStream(path, route) {
  return route.get(path)
    .pipe(critical({
      width: 1300,
      height: 900
    }));
}

module.exports = function () {

  var hexo = this,
      route  = hexo.route;

  var routes = route.list().filter(function(path) {
      return minimatch(path, '**/*.html', { nocase: true });
  });

  console.log(routes);

  routes.forEach(function (path) {

    console.log(testStream(path, route));

  });


  //
  // critical.generate({
  //   html: str,
  //   width: 1300,
  //   height: 900
  // }).then(function (output) {
  //     // You now have critical-path CSS
  //     // Works with and without dest specified
  //     console.log(Object.keys(output));
  // }).error(function (err) {
  // });

}
