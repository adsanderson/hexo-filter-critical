'use strict';

var tempFiles = require('./tempFiles');

var fs = require('fs');
var critical = require('critical').stream;
var through2 = require('through2');
var gs = require('glob-stream');
var File = require('vinyl');
var terminus = require("terminus");

function createVinylFileWithContent(globFile, enc, cb) {
  globFile.contents = fs.readFileSync(globFile.path);
  let vinylFile = new File(globFile);
  cb(null, vinylFile);
}

function setInlineContentFull (htmlRoutes, route, tempPathLength, file, enc, cb) {
  let fileRoute = file.path.substr(tempPathLength);
  if (htmlRoutes.indexOf(fileRoute) !== -1) {
      route.set(fileRoute, file.contents);
  }
  cb(null, file);
}

module.exports = function getCriticalPathContent (htmlRoutes, route) {
  return new Promise((resolve, reject) => {

    let tempPathLength = tempFiles.tmpobj.name.length + 1;
    let setInlineContent = setInlineContentFull.bind(null, htmlRoutes, route, tempPathLength);

    let streamOfTempHTMLfiles = gs(`**/*.html`, {cwd: `${tempFiles.tmpobjGlobName}/`});

    streamOfTempHTMLfiles
    .pipe(through2.obj(createVinylFileWithContent))
    .pipe(critical({
      base: tempFiles.tmpobj.name,
      inline: true,
      width: 900,
      height: 1300
    }))
    .pipe(through2.obj(setInlineContent))
    .pipe(terminus.devnull({ objectMode: true }))
    .on('error', (err) => {
      console.log('error: ' + err);
      reject();
    })
    .on('end', () => {
      resolve();
    })
    .on('finish', () => {
      resolve();
    });

  });
}