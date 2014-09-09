var ripple = require('ripple');
var each = require('each');
var computed = require('computed');
var events = require('events');
var clone = require('clone');
var fmt = require('fmt');
var query = require('query');

var loadStyles = require('load-styles');

var translations = {
    cz: require('./languages/cz.json'),
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

var View = ripple(require('./template.html'))
.use(each)
.use(computed)
.use(events);

View.RATING_STATE = 1;
View.FEEDBACK_STATE = 2;
View.THANKS_STATE = 3;
View.FILLED_STATE = 4;

View.directive('disabled', {
    update: function(value, el, view) {
        el.disabled = value;
    },
});

View.parse = function(options) {
    if (options.scope) {
        // Do not use any defaults for sub views
        return options.data;
    }
    return {
        feedback: options.feedback || '',
        language: options.language || 'en',
        poweredBy: options.poweredBy !== false,
        state: options.state || View.RATING_STATE,
        rating: typeof options.rating === 'number' ? options.rating : null,
        visible: !!options.visible,
        skin: options.skin || 'dialog',
        theme: options.theme || 'gray',
        us: options.us
    };
};

View.computed('classes', ['state', 'visible', 'poweredBy', 'skin'], function() {
    var result = [];
    switch (this.get('state')) {
        case View.RATING_STATE:
            result.push('nps-rating-visible');
            break;
        case View.FEEDBACK_STATE:
            result.push('nps-feedback-visible');
            break;
        case View.THANKS_STATE:
            result.push('nps-thanks-visible');
            break;
        case View.FILLED_STATE:
            result.push('nps-filled-visible');
            break;
    }
    if (this.get('visible')) {
        result.push('nps-visible');
    }
    if (this.get('poweredBy')) {
        result.push('nps-is-powered-by');
    }
    if (this.get('skin') === 'dialog') {
        result.push('nps-dialog');
    }
    if (this.get('skin') === 'page') {
        result.push('nps-page');
    }
    result.push('nps-' + this.get('theme'));
    return result.join(' ');
});

View.computed('translation', ['language', 'us'], function() {
    var translation = clone(translations[this.get('language')]);
    translation.HOW_LIKELY = fmt(translation.HOW_LIKELY, this.get('us') || translation.US);
    return translation;
});

View.computed('ratings', ['rating'], function() {
    var selectedRating = this.get('rating');
    return [0,1,2,3,4,5,6,7,8,9,10].map(function(rating) {
        return {
            valueClass: selectedRating !== null && rating <= selectedRating ?
                'nps-selected' : ''
        };
    });
});
View.computed('ratingDisabled', ['rating'], function() {
    return this.get('rating') === null;
});

View.prototype.show = function() {
    // Make sure the initial position is applied for animation start.
    window.getComputedStyle(this.el).right; //jshint ignore:line
    this.set('visible', true);
};
View.prototype.hide = function() {
    this.set('visible', false);
};
View.prototype.selectRating = function selectRating(rating) {
    this.set('rating', rating);
};
View.prototype.dismiss = function() {
    this.hide();
    this.emit('dismiss');
};
View.prototype.ratingSubmit = function() {
    this.emit('submit');
    this.set('state', View.FEEDBACK_STATE);
    setTimeout(function () {
        query('.nps-feedback .nps-text', this.el).focus();
    }, 1);
};
View.prototype.feedbackSubmit = function() {
    this.emit('submit');
    this.set('state', View.THANKS_STATE);
};
View.prototype.setFeedback = function(event) {
  this.set('feedback', event.target.value);
};

module.exports = View;
