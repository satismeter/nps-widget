var path = require('path');
var through = require('through2');
var autoprefixer = require('autoprefixer-core');

var extensions = ['.css', '.sass', '.scss', 'less'];

module.exports = function (b, opts) {
  if (extensions.indexOf(path.extname(b)) === -1) {
    return through();
  }

  var input = '';
  function read(data, encoding, callback) {
    input += data;
    callback();
  }

  function end() {
    this.push(autoprefixer.process(input).css);
    this.push(null);
  }

  return through(read, end);
};
