var Survey = require('./survey');

var ATTRS = [
  'rating',
  'feedback',
  'visible',
  'state',
  'translation',
  'language',
  'serviceName',
  'poweredBy',
  'skin',
  'theme',
  'position'
];

function View(options) {
  options = options || {};
  var data = {};
  ATTRS.forEach(function(attr) {
    if (options[attr] !== undefined) {
      data[attr] = options[attr];
    }
  });

  this.survey = new Survey({data: data});
  this.survey.$mount();
  this.survey.$appendTo(options.parent || document.body);
}
View.prototype = {
  get el() {
    return this.survey.$el;
  },
  destroy: function() {
    this.survey.$destroy(true);
  },
  remove: function() {
    this.survey.$remove();
  },
  on: function(event, callback) {
    return this.survey.$on(event, callback);
  },
  show: function() {
    this.survey.show();
  },
  hide: function() {
    this.survey.hide();
  }
};

ATTRS.forEach(function(attr) {
  Object.defineProperty(View.prototype, attr, {
    get: function() {
      return this.survey[attr];
    },
    set: function(value) {
      this.survey[attr] = value;
    }
  });
});

module.exports = View;
