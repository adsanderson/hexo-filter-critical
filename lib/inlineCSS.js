'use strict';

var parse5 = require('parse5');

// var parser = new parse5.Parser();
// //Instantiate new serializer with default tree adapter
// var serializer = new parse5.Serializer();

module.exports = function (htmlContent) {
  return new Promise((resolve, reject) => {
    var parsedDom = parse5.parseFragment(htmlContent);
    console.log(parsedDom);
    resolve();
  });
}
