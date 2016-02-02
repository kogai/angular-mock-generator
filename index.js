const path = require('path');
const stream = require('stream');
const fs = require('fs');

const through = require('through2');
const camelCase = require('camel-case');

function Mock(moduleName, pathToSrc, isDebug) {
  this.moduleName = moduleName;
  this.pathToSrc = pathToSrc;
  this.distStreams = [
    isDebug ? process.stdout : fs.createWriteStream(`${pathToSrc}.mock.angular.js`),
    isDebug ? process.stdout : fs.createWriteStream(`${pathToSrc}.mock.node.js`),
  ];

  this.nameSpace = camelCase(this.pathToSrc);
  this.src = require(pathToSrc);

  this.readable = new stream.Readable();

  this.tempateAngular = `angular.module('${this.moduleName}').value('${this.nameSpace}', ${JSON.stringify(this.src)});`;
  this.tempateNodejs = `module.exports = function() {${this.tempateAngular}}`;
}

Mock.prototype.write = function(tempateName) {
  this.distStreams.forEach((s, i)=> {
    const templateStream = new stream.Readable();

    templateStream._read = function noop() {};
    templateStream.push(i === 0 ? this.tempateNodejs : this.tempateAngular);
    templateStream.push(null);

    templateStream.pipe(s);
  });
};

module.exports = Mock;
