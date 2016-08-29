var Vue = require('vue');
var Color = require('color');
var insertCss = require('insert-css');
var bind = require('component-bind');
var escape = require('escape-html');
var is = require('is');
var dom = require('vue/src/util/dom');

var MESSAGES = require('./messages');

insertCss(require('./index.scss'));

var COLORS = {
  gray: '#666',
  pink: '#ff4981',
  green: '#4CD964',
  blue: '#007AFF',
  red: '#FF3A2D',
  yellow: '#FFCC00',
  orange: '#FF9500',
  violet: '#C643FC',
  lightBlue: '#3FA2D9',
  darkGreen: '#2FB12C'
};

var RATING_STATE = 'rating';
var FEEDBACK_STATE = 'feedback';
var THANKS_STATE = 'thanks';
var FILLED_STATE = 'filled';

var DIALOG_SKIN = 'dialog';
var PANEL_SKIN = 'panel';
var BAR_SKIN = 'bar';

var Survey = Vue.extend({
  template: require('./survey.html'),
  partials: {
    rating: require('./rating.html'),
    feedback: require('./feedback.html'),
    thanks: require('./thanks.html'),
    filled: require('./filled.html'),
    'powered-by': require('./powered-by.html'),
    panel: require('./panel.html'),
    dialog: require('./dialog.html'),
    bar: require('./bar.html')
  },
  components: {
    'nps-textarea': require('./components/textarea'),
    'nps-button': require('./components/button'),
    'nps-link': require('./components/link'),
    'nps-scale': require('./components/scale'),
  },
  replace: true,
  data: function() {
    return {
      // model
      rating: null,
      feedback: '',
      reason: '',
      answers: [],

      // state
      visible: false,
      state: RATING_STATE,
      translation: null,

      // settings
      serviceName: null,
      poweredBy: true,
      skin: DIALOG_SKIN,
      preview: false, // preview mode - positioned inside a preview div
      position: 'cr', // tl (top-right), tr, bl, br
      test: false,
      showNumbers: false,
      colors: {
        background: '#FDFDFD',
        foreground: '#333',
        primary: '#ff4981',
      }
    };
  },
  computed: {
    questions: function() {
      return this.t('QUESTIONS') || [];
    },
    showCloseIcon: function() {
      return this.state === FEEDBACK_STATE || this.state === RATING_STATE;
    },
    showFeedbackText: function() {
      return this.state === FEEDBACK_STATE;
    },
    ratings: function() {
      return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(bind(this, function(rating) {
        var isHighlighted = is.number(this.visibleRating) && rating <= this.visibleRating;
        return {
          rating: rating,
          color: (isHighlighted) ? c('primary') : c('light')
        };
      }));
    },
    likelyHtml: function() {
      var serviceName = is.string(this.serviceName) ? this.serviceName.trim() : null;
      var howLikelyUs = this.t('HOW_LIKELY_US');
      var howLikely = this.t('HOW_LIKELY');

      if (!serviceName && howLikelyUs) {
        return escape(howLikelyUs);
      }

      var serviceHtml = serviceName ? '<b>' + escape(serviceName) + '</b>' : this.t('US');
      return '<span>' + escape(howLikely).replace('%s', serviceHtml) + '</span>';
    },

    poweredByHtml: function() {
      var linkHtml = '<a href="https://satismeter.com" style="color: ' + this.c('primary') + '" target="_blank">SatisMeter</a>';
      return escape(this.t('POWERED_BY')).replace('%s', linkHtml);
    },

    hasReasons: function() {
      var reasons = this.t('REASONS');
      return reasons && reasons.length > 0;
    },
    hasQuestions: function() {
      var questions = this.t('QUESTIONS');
      return questions && questions.length > 0;
    },
    vertical: function() {
      switch (this.position[0]) {
        case 'b':
          return 'bottom';
        case 't':
          return 'top';
        default:
          return 'middle';
      }
    },
    horizontal: function() {
      switch (this.position[1]) {
        case 'l':
          return 'left';
        case 'r':
          return 'right';
        default:
          return 'center';
      }
    },
    previewClass: function() {
      if (this.preview) {
        return 'nps-preview';
      }
      return '';
    },
    category: function() {
      if (!is.number(this.rating)) {
        return null;
      }
      if (this.rating <= 6) {
        return 'detractor';
      }
      if (this.rating <= 8) {
        return 'passive';
      }
      return 'promoter'
    },
    direction: function() {
      return this._t('DIRECTION') || 'ltr';
    }
  },
  ready: function() {
      this.initAnswers();
  },
  watch: {
    questions: function() {
      this.initAnswers();
    }
  },
  methods: {
    initAnswers: function() {
      this.answers = this.questions.map(function(question) {
        return {
          name: question.name,
          label: question.label,
          value: null
        };
      });
    },
    inState: function() {
      var states = Array.prototype.slice.call(arguments);
      return states.indexOf(this.state) !== -1;
    },
    nextTick: function(fn) {
      Vue.nextTick(bind(this, function() {
        if (this._isDestroyed) {
          return;
        }
        fn.call(this);
      }));
    },
    setTimeout: function(fn, timeout) {
      setTimeout(bind(this, function() {
        if (this._isDestroyed) {
          return;
        }
        fn.call(this);
      }), timeout);
    },
    _t: function(key, param) {
      if (this.translation) {
        if (this.translation[key]) {
          return this.translation[key];
        }
      }
      return MESSAGES[key];
    },
    t: function(key, param) {
      var value;
      if (key === 'FOLLOWUP') {
        value = this.t('IMPROVE');
        if (value) {
          return value;
        }
        value = this.t('THANKS_IMPROVE');
        if (value) {
          return value;
        }
      }
      if (this.category) {
        value = this._t(key + '_' + this.category.toUpperCase());
        if (value) {
          return value;
        }
      }
      return this._t(key, value);
    },
    _c: function(type) {
      if (this.colors[type]) {
        return this.colors[type];
      }
      if (type === 'light') {
        return Color(this.colors.primary).mix(Color(this.colors.background), 0.4).hexString();
      }
      if (type === 'background-light') {
        return Color(this.colors.primary).mix(Color(this.colors.background), 0.04).hexString();
      }
      if (type === 'foreground-light') {
        return Color(this.colors.foreground).mix(Color(this.colors.background), 0.6).hexString();
      }
      if (type === 'shadow') {
        return Color(this.colors.foreground).mix(Color(this.colors.background), 0.1).hexString();
      }
      if (type === 'border') {
        return Color(this.colors.foreground).mix(Color(this.colors.background), 0.15).hexString();
      }
    },
    c: function(type) {
      var color = this._c(type);
      if (color && COLORS[color]) {
        return COLORS[color];
      }
      return color;
    },
    show: function() {
      this.visible = true;
    },
    hide: function() {
      this.visible = false;
    },
    stopPropagation: function(e) {
      e.stopPropagation();
    },
    legend(section, index) {
      var question = this.questions[index];
      if (section === 'low') {
        return (question && question.lowLegend) || this.t('LOW_LEGEND');
      }
      else {
        return (question && question.highLegend) || this.t('HIGH_LEGEND');
      }
    }
  },
  events: {
    submit: function() {
      this.$dispatch('submit');
      this.state = THANKS_STATE;
      if (this.skin === DIALOG_SKIN || this.skin === BAR_SKIN) {
        this.setTimeout(function() {
          this.hide();
        }, 800);
      }
    },
    selectRating: function (rating) {
      this.rating = rating;
      this.state = FEEDBACK_STATE;
      this.$emit('ratingSelect');
      this.setTimeout(function() {
        if (this.hasReasons) {
          this.$$.reasons[0].focus();
        }
        else if (this.hasQuestions) {
          // do nothing
        }
        else {
          this.$.feedback.focus();
        }
      }, 400);
    },
    close: function() {
      this.hide();
      this.$emit('dismiss');
    },
  },
  transitions: {
    next: {
      leave: function(el, done) {
        if (this.test) {
          return done();
        }
        if (!this.visible) {
          return done();
        }
        this.leave = el;
        this.setTimeout(function() {
          done();
          delete this.leave;
        }, 600);
      },
      enter: function(enter, done) {
        if (this.test) {
          return done();
        }
        if (!this.visible) {
          return done();
        }
        var content = enter.parentNode;
        var bounding = content.parentNode;
        var leave = this.leave;

        bounding.style.height = getComputedStyle(leave || enter).height;
        content.style.top = 0;
        if (leave) {
          leave.style.opacity = 1;
        }

        this.setTimeout(function() {
          dom.addClass(bounding, 'nps-next');
          this.setTimeout(function() {
            content.style.top = '-' + bounding.style.height;
            bounding.style.height = getComputedStyle(enter).height;
            if (leave) {
              leave.style.opacity = 0;
            }

            this.setTimeout(function() {
              dom.removeClass(bounding, 'nps-next');
              content.style.top = '';
              if (leave) {
                leave.style.display = 'none';
              }
              bounding.style.height = '';
              done();
            }, 500);
          }, 0);
        }, 0);
      }
    }
  }
});

module.exports = Survey;
