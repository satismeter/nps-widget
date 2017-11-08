var Base = require('./base');

var Text = Base.extend({
  template: require('./link.html'),
  paramAttributes: ['href', 'target'],
  data: function() {
    return {
      href: '',
      target: ''
    };
  }
});

module.exports = Text;
