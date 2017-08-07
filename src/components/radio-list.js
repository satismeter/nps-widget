var Base = require('./base');
var is = require('is');
var range = require('lodash/range');

var lastId = 0;
function generateId() {
  return ++lastId;
}

module.exports = Base.extend({
  template: require('./radio-list.html'),
  paramAttributes: ['name', 'choices', 'value'],
  data: function() {
    return {
      name: 'radio-list-' + generateId(),
      choices: [],
      value: ''
    };
  }
});
