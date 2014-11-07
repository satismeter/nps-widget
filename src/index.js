var Vue = require('vue');
var loadStyles = require('load-styles');

Vue.config({
  enterClass: 'nps-enter',
  leaveClass: 'nps-leave'
});

var messages = {
  cs: require('./languages/cs.json'),
  cz: require('./languages/cs.json'), // backward compatibility
  de: require('./languages/de.json'),
  en: require('./languages/en.json'),
  es: require('./languages/es.json'),
  fr: require('./languages/fr.json'),
  it: require('./languages/it.json'),
  pl: require('./languages/pl.json'),
  'pt-br': require('./languages/pt-br.json'),
  ru: require('./languages/ru.json'),
  sk: require('./languages/sk.json'),
  tr: require('./languages/tr.json')
};

loadStyles(require('./style.css'));

var FEEDBACK_STATE = 'feedback';
var THANKS_STATE = 'thanks';
var FILLED_STATE = 'filled';

var ATTRS = {
  // model
  rating: null,
  feedback: '',

  // state
  visible: false,
  state: FEEDBACK_STATE,
  translation: null,

  // settings
  language: 'en',
  us: null,
  poweredBy: true,
  skin: 'dialog',
  theme: 'pink',
  position: 'tr', // tl (top-right), tr, bl, br
  distance: 50 // distance from top/bottom border
};

var Survey = Vue.extend({
  template: require('./survey.html'),
  components: {
    scale: {
      template: require('./scale.html'),
      replace: true
    },
    feedback: {
      template: require('./feedback.html'),
      replace: true
    },
    thanks: {
      template: require('./thanks.html'),
      replace: true
    },
    filled: {
      template: require('./filled.html'),
      replace: true
    }
  },
  replace: true,
  data: ATTRS,
  attached: function() {
    if (this.rating !== null) {
      this.focusFeedback();
    }
  },
  computed: {
    topPosition: function() {
      if (this.vertical === 'top') {
        return this.distance + 'px';
      }
      return '';
    },
    bottomPosition: function() {
      if (this.vertical === 'bottom') {
        return this.distance + 'px';
      }
      return '';
    },
    vertical: function() {
      switch (this.position[0]) {
        case 'b':
          return 'bottom';
        default:
          return 'top';
      }
    },
    horizontal: function() {
      switch (this.position[1]) {
        case 'l':
          return 'left';
        default:
          return 'right';
      }
    },
    showCloseIcon: function() {
      return this.state === FEEDBACK_STATE && this.skin==='dialog';
    },
    showSubmitButton: function() {
      return this.state === FEEDBACK_STATE && this.rating !== null;
    },
    showFeedbackText: function() {
      return this.rating !== null;
    },
    ratings: function() {
      var selectedRating = this.rating;
      return [0,1,2,3,4,5,6,7,8,9,10].map(function(rating) {
        return {
          selected: selectedRating !== null && rating <= selectedRating
        };
      });
    }
  },
  methods: {
    t: function(key, param) {
      var message = (this.translation && this.translation[key]) || messages[this.language][key];
      return message.replace('%s', param);
    },
    selectRating: function (rating) {
      this.rating = rating;
      this.focusFeedback();
    },
    focusFeedback: function() {
      var $el = this.$el;
      Vue.nextTick(function () {
        var $feedback = $el.querySelector('.nps-Feedback-text');
        if ($feedback) {
          $feedback.focus();
        }
      });
    },
    show: function() {
      this.visible = true;
    },
    close: function() {
      this.hide();
      if (this.state === FEEDBACK_STATE) {
        this.$emit('dismiss');
      }
    },
    hide: function() {
      this.visible = false;
    },
    ratingSubmit: function() {
      this.$emit('submit');
      this.state = THANKS_STATE;
      if (this.skin !== 'page') {
        var that = this;
        setTimeout(function() { that.hide() }, 800);
      }
    }
  }
});

function View(options) {
  var options = options || {};
  var data = {};
  Object.keys(ATTRS).forEach(function(attr) {
    if (options[attr] !== undefined) {
      data[attr] = options[attr];
    }
  });

  this.survey = new Survey({data: data});
  this.survey.$appendTo(options.parent || document.body);
}
View.prototype = {
  get el() {
    return this.survey.$el;
  },
  destroy: function() {
    this.survey.$destroy();
  },
  on: function(event, callback) {
    return this.survey.$on(event, callback);
  },
  show: function() {
    this.survey.show();
  }
}
Object.keys(ATTRS).forEach(function(attr) {
  Object.defineProperty(View.prototype, attr, {
    get: function() {
      return this.survey[attr];
    },
    set: function(value) {
      this.survey[attr] = value;
    }
  })
});

module.exports = View;
