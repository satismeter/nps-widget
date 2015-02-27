var Vue = require('vue');
var insertCss = require('insert-css');
var bind = require('component-bind');
var escape = require('escape-html');
var is = require('is');
var dom = require('vue/src/util/dom');

var MESSAGES = require('nps-translations');

insertCss(require('./index.scss'));

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
    scale: require('./scale.html'),
    thanks: require('./thanks.html'),
    filled: require('./filled.html'),
    'powered-by': require('./powered-by.html'),
    panel: require('./panel.html'),
    dialog: require('./dialog.html'),
    bar: require('./bar.html')
  },
  replace: true,
  data: function() {
    return {
      // model
      rating: null,
      feedback: '',
      reason: '',

      // state
      visible: false,
      state: RATING_STATE,
      translation: null,

      // settings
      language: 'en',
      serviceName: null,
      poweredBy: true,
      skin: DIALOG_SKIN,
      theme: 'pink',
      preview: false, // preview mode - positioned inside a preview div
      position: 'cr', // tl (top-right), tr, bl, br
      test: false
    };
  },
  ready: function() {
    if (this.showFeedbackText) {
      this.setTimeout(bind(this, this.focusFeedback), 600);
    }
  },
  computed: {
    showCloseIcon: function() {
      return this.state === FEEDBACK_STATE || this.state === RATING_STATE;
    },
    showFeedbackText: function() {
      return this.state === FEEDBACK_STATE;
    },
    ratings: function() {
      var selectedRating = this.rating;
      return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(function(rating) {
        return {
          rating: rating,
          selected: selectedRating !== null && rating <= selectedRating
        };
      });
    },
    likelyHtml: function() {
      var serviceName = is.string(this.serviceName) ? this.serviceName.trim() : null;
      var us = this.t('US');
      var serviceHtml = serviceName ? '<b>' + escape(serviceName) + '</b>' : us;
      return escape(this.t('HOW_LIKELY')).replace('%s', serviceHtml);
    },
    hasReasons: function() {
      var reasons = this.t('REASONS');
      return reasons && reasons.length > 0;
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
    }
  },
  methods: {
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
        if (key === 'FOLLOWUP' && this.translation['IMPROVE']) {
          return this.translation['IMPROVE'];
        }
      }
      var shortLanguage = is.string(this.language) ? this.language.split('_')[0] : '';
      var messages = MESSAGES[this.language] || MESSAGES[shortLanguage] || MESSAGES.en;
      return messages[key];
    },
    t: function(key, param) {
      if (this.category) {
        var value = this._t(key + '_' + this.category.toUpperCase());
        if (value) {
          return value;
        }
      }
      return this._t(key, value);
    },
    selectRating: function (rating) {
      this.rating = rating;
      this.state = FEEDBACK_STATE;
      setTimeout(bind(this, this.focusFeedback), 500);
    },
    focusFeedback: function() {
      this.nextTick(function () {
        var $feedback = this.$el.querySelector('input') || this.$el.querySelector('textarea');
        if ($feedback) {
          this.nextTick(function() {
            $feedback.focus();
          });
        }
      });
    },
    show: function() {
      this.visible = true;
    },
    hide: function() {
      this.visible = false;
    },
    submit: function() {
      this.$emit('submit');
      this.state = THANKS_STATE;
      if (this.skin === DIALOG_SKIN || this.skin === BAR_SKIN) {
        this.setTimeout(function() {
          this.hide();
        }, 800);
      }
    },
    onClose: function() {
      this.hide();
      this.$emit('dismiss');
    }
  },
  transitions: {
    next: {
      leave: function(el, done) {
        if (this.test) {
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
