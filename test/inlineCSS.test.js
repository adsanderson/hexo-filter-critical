'use strict';

var test = require('tape');

var inlineCSS = require('../lib/inlineCSS');

test('test inline CSS test', function (t) {

  let mockHtmlContent = `
    <html>
      <head>
        <title>test title</title>
      </head>
      <body>
      </body>
    </html>`;

  let mockCssContent = 'Css content';

  inlineCSS(mockHtmlContent, mockCssContent)
  .then((updatedDom) => {
    t.notEqual(updatedDom.indexOf(mockCssContent), -1);
    t.end()
  })
  .catch((err) => {
    t.end(err);
  });

  // var dummyContent = 'some content here sadkfjh sakdlfh sajkdfh ksajldfh ksaljd fhjksadfh ksjadfh salkjdfh ksajldfh aksljd fhjksald fhksajd fhsajkd fhksajld fhjksa';
  // var hexo = setupHexo(dummyContent);
  //
  // var routes = hexo.route.routes;
  //
  // t.plan(5);
  //
  // gzip.call(hexo).then(function () {
  //     t.equal(routes['some-file.png'].data.toString().length, dummyContent.length);
  //     t.equal(routes['some-file.xml'].data.toString().length, dummyContent.length);
  //
  //     t.notEqual(routes['some-file.html'].data.toString().length, dummyContent.length);
  //     t.notEqual(routes['some-file.css'].data.toString().length, dummyContent.length);
  //     t.notEqual(routes['some-file.js'].data.toString().length, dummyContent.length);
  // });
});
