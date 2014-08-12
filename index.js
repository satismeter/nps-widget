var ripple = require('ripple');
var each = require('each');
var computed = require('computed');
var events = require('events');
var clone = require('clone');
var fmt = require('fmt');

import loadStyles from 'load-styles';

var translations = {
    cz: require('./languages/cz'),
    de: require('./languages/de'),
    en: require('./languages/en'),
    es: require('./languages/es'),
    fr: require('./languages/fr'),
    it: require('./languages/it'),
    pl: require('./languages/pl'),
    'pt-br': require('./languages/pt-br'),
    ru: require('./languages/ru'),
    sk: require('./languages/sk'),
    tr: require('./languages/tr')
};

loadStyles(require('./style'));
loadStyles(require('./button'));

var View = ripple(require('./template'))
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
View.computed('feedbackDisabled', ['feedback'], function() {
    return this.get('feedback') === '';
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
};
View.prototype.feedbackSubmit = function() {
    this.emit('submit');
    this.set('state', View.THANKS_STATE);
};
View.prototype.setFeedback = function(event) {
  this.set('feedback', event.target.value);
};

export default View;
