'use strict';

var parse5 = require('parse5');
var treeAdapter = parse5.treeAdapters.default;

function createStyleElement (cssContent) {
  let styleTag = treeAdapter.createElement('style', 'http://www.w3.org/1999/xhtml', []);
  treeAdapter.insertText(styleTag, cssContent);
  return styleTag;
}

function findHeadTag (domAst, cssContent) {

  function searchChildNodes (childNodes) {
    childNodes.some(function(node) {
      if (node.tagName === 'head') {
        headElm = node;
        return true;
      }
      if (node.childNodes.length > 0 ) {
        searchChildNodes(node.childNodes);
      }
      return false;
    });
  }


  let headElm;
  searchChildNodes(domAst.childNodes);
  treeAdapter.appendChild(headElm, createStyleElement(cssContent));
}

module.exports = function (htmlContent, cssContent) {
  return new Promise((resolve, reject) => {
    var parsedDom = parse5.parse(htmlContent);
    findHeadTag(parsedDom, cssContent);
    resolve(parse5.serialize(parsedDom));
  });
}
