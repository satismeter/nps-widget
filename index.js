var Vue = require('vue');
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

var RATING_STATE = 'rating';
var FEEDBACK_STATE = 'feedback';
var THANKS_STATE = 'thanks';
var FILLED_STATE = 'filled';

var View = Vue.extend({
    template: require('./template.html'),
    replace: true,
    data: {
        language: 'en',
        rating: null,
        us: null,
        visible: false,
        poweredBy: true,
        skin: 'dialog',
        theme: 'pink',
        state: RATING_STATE,
        ratingDisabled: true,
        feedback: ''
    },
    computed: {
        translation: function() {
            var translation = clone(translations[this.language]);
            translation.HOW_LIKELY = fmt(translation.HOW_LIKELY, this.us || translation.US);
            return translation;
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
        selectRating: function (rating) {
            this.rating = rating;
        },
        show: function() {
            // Make sure the initial position is applied for animation start.
            window.getComputedStyle(this.$el).right; //jshint ignore:line
            this.visible = true;
        },
        close: function() {
            this.hide();
            if (this.state === RATING_STATE) {
                this.$dispatch('dismiss');
            }
        },
        hide: function() {
            this.visible = false;
        },
        ratingSubmit: function() {
            this.$dispatch('submit');
            this.state = FEEDBACK_STATE;
            Vue.nextTick(function () {
                query('.nps-Survey-feedback', this.$el).focus();
            }.bind(this));
        },
        feedbackSubmit: function() {
            this.$dispatch('submit');
            this.state = THANKS_STATE;
        }
    }

});

module.exports = View;
