var Vue = require('vue');
var loadStyles = require('load-styles');
var bind = require('component-bind');

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

loadStyles(require('./index.css'));

var FEEDBACK_STATE = 'feedback';
var THANKS_STATE = 'thanks';
var FILLED_STATE = 'filled';

var DIALOG_SKIN = 'dialog';
var PANEL_SKIN = 'panel';
var PREVIEW_SKIN = 'preview';

var Survey = Vue.extend({
  template: require('./survey.html'),
  partials: {
    feedback: require('./feedback.html'),
    scale: require('./scale.html'),
    thanks: require('./thanks.html'),
    filled: require('./filled.html')
  },
  components: {
    text: {
      ready: function() {
        this.$el.placeholder = this.placeholder;
      },
      watch: {
        'placeholder': function(placeholder) {
          this.$el.placeholder = placeholder;
        }
      }
    }
  },
  replace: true,
  data: function() {
    return {
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
      skin: DIALOG_SKIN,
      theme: 'pink',
      position: 'cr', // tl (top-right), tr, bl, br
    };
  },
  ready: function() {
    if (this.showFeedbackText) {
      this.focusFeedback();
    }
  },
  computed: {
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
    classNames: function() {
      if (this.skin === DIALOG_SKIN || this.skin === PREVIEW_SKIN) {
        return [
          'nps-Dialog',
          'nps-Dialog--' + this.horizontal,
          'nps-Dialog--' + this.vertical,
          this.skin === PREVIEW_SKIN ? 'nps-Dialog--preview' : ''
        ].join(' ');
      }
      if (this.skin === PANEL_SKIN) {
        return 'nps-Panel';
      }
      if (this.skin === PREVIEW_SKIN) {
        return [
          'nps-Preview',
          'nps-Preview--' + this.horizontal,
          'nps-Preview--' + this.vertical
          ].join(' ');
      }
    },
    showCloseIcon: function() {
      return this.state === FEEDBACK_STATE || this.skin===DIALOG_SKIN;
    },
    showSubmitButton: function() {
      return this.state === FEEDBACK_STATE && this.rating !== null;
    },
    showFeedbackText: function() {
      return this.state === FEEDBACK_STATE && this.rating !== null;
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
      Vue.nextTick(bind(this, function () {
        if (this._isDestroyed) {
          return;
        }
        var $feedback = this.$el.querySelector('.nps-Feedback-text');
        if ($feedback) {
          $feedback.focus();
        }
      }));
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
    submit: function() {
      this.$emit('submit');
      this.state = THANKS_STATE;
      if (this.skin === DIALOG_SKIN || this.skin === PREVIEW_SKIN) {
        setTimeout(bind(this, function() {
          if (this._isDestroyed) {
            return;
          }
          this.hide();
        }), 800);
      }
    }
  }
});

module.exports = Survey;
