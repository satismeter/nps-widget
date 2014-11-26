var path = require('path');
var through = require('through2');
var sass = require('node-sass');
var autoprefixer = require('autoprefixer-core');

// Process with sass and autoprefixer
function process(file) {
  var css = sass.renderSync({file: file});
  var prefixed = autoprefixer.process(css).css;
  return prefixed;
}

module.exports = function (b, opts) {
  if (path.extname(b) !== '.scss') {
    return through();
  }

  function read(data, encoding, callback) {
    callback();
  }

  function end() {
    this.push(process(b));
    this.push(null);
  }

  return through(read, end);
};
