var is = require('is');
var Survey = require('./survey');

var ATTRS = [
  'rating',
  'feedback',
  'reason',
  'visible',
  'state',
  'translation',
  'serviceName',
  'poweredBy',
  'skin',
  'theme',
  'position',
  'embed',
  'test',
  'showNumbers',
  'requireFeedback',
  'colors',
  'questions',
  'answers'
];

function View(options) {
  options = options || {};
  var data = {};
  ATTRS.forEach(function(attr) {
    if (is.defined(options[attr])) {
      data[attr] = options[attr];
    }
  });
  if (is.defined(options.preview)) {
    data.embed = options.preview;
  }
  if (!data.state) {
    data.state = is.number(data.rating) ? 'feedback' : 'rating';
  }

  this.survey = new Survey({
    data: data
  });
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

Object.defineProperty(View.prototype, 'preview', {
  get: function() {
    return this.survey.embed;
  },
  set: function(value) {
    this.survey.embed = value;
  }
});


module.exports = View;
