'use strict';

var test = require('tape');

var inlineCSS = require('../lib/inlineCSS');

test('add style tag and content to empty head', function (t) {

  let mockHtmlContentTitle = '<title>test title</title>';

  let mockHtmlContent = `
    <html>
      <head>
        ${mockHtmlContentTitle}
      </head>
      <body>
      </body>
    </html>`;

  let mockCssContent = 'Css content';

  inlineCSS(mockHtmlContent, mockCssContent)
  .then((updatedDom) => {
    t.notEqual(updatedDom.indexOf('<style>'), -1, 'should contain opening style tag') ;
    t.notEqual(updatedDom.indexOf(mockCssContent), -1, 'content should exist');
    t.notEqual(updatedDom.indexOf('</style>'), -1, 'should contain closing style tag');
    t.notEqual(updatedDom.indexOf(mockHtmlContentTitle), -1, 'title tag should not be effected');
    t.end();
  })
  .catch((err) => {
    t.fail(err);
  });

});
