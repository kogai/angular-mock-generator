const path = require('path');
const stream = require('stream');
const fs = require('fs');

const through = require('through2');
const camelCase = require('camel-case');

function Mock(moduleName, pathToSrc, isDebug) {
  this.moduleName = moduleName;
  this.pathToSrc = pathToSrc;

  const parsed = path.parse(this.pathToSrc);
  const nameSpace = camelCase(parsed.dir);
  this.src = require(pathToSrc);

  this.readable = new stream.Readable();

  this.pkgs = {};
  this.pkgs.angular = {
    stream: isDebug ? process.stdout : fs.createWriteStream(`${rename(pathToSrc, 'angular')}`),
    template: `angular.module('${this.moduleName}').value('${nameSpace}', ${JSON.stringify(this.src)});`,
  };
  this.pkgs.nodejs = {
    stream: isDebug ? process.stdout : fs.createWriteStream(`${rename(pathToSrc, 'node')}`),
    template: `module.exports = function() {${this.pkgs.angular.template}}`,
  };
  this.keys = Object.keys(this.pkgs);
}

function noop() {}

function rename (srcName, addition) {
  const parsed = path.parse(srcName);
  return [parsed.dir, '/', parsed.name, '.', addition, parsed.ext].join('');
}


Mock.prototype.write = function() {
  this.keys.forEach((key)=> {
    const templateStream = new stream.Readable();

    templateStream._read = noop;
    templateStream.push(this.pkgs[key].template);
    templateStream.push(null);

    templateStream.pipe(this.pkgs[key].stream);
  });
};

module.exports = Mock;
