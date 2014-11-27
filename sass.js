var path = require('path');
var through = require('through2');
var sass = require('node-sass');

var extensions = ['.scss', '.sass'];

module.exports = function (b, opts) {
  if (extensions.indexOf(path.extname(b)) === -1) {
    return through();
  }

  function read(data, encoding, callback) {
    callback();
  }

  function end() {
    this.push(sass.renderSync({file: b}));
    this.push(null);
  }

  return through(read, end);
};
