var Vue = require('vue');
var query = require('query');
var bind = require('bind');
var loadStyles = require('load-styles');

Vue.config({
    enterClass: 'nps-enter',
    leaveClass: 'nps-leave'
});

var messages = {
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

var FEEDBACK_STATE = 'feedback';
var THANKS_STATE = 'thanks';
var FILLED_STATE = 'filled';

var Scale = Vue.extend({
});

var View = Vue.extend({
    template: require('./template.html'),
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
    data: {
        language: 'en',
        rating: null,
        us: null,
        visible: false,
        poweredBy: true,
        skin: 'dialog',
        theme: 'pink',
        state: FEEDBACK_STATE,
        feedback: ''
    },
    attached: function() {
        if (this.rating !== null) {
            this.focusFeedback();
        }
    },
    computed: {
        showCloseIcon: function() {
            return this.state === FEEDBACK_STATE && this.skin==='dialog';
        },
        showSubmitButton: function() {
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
            return messages[this.language][key].replace('%s', param);
        },
        selectRating: function (rating) {
            this.rating = rating;
            this.focusFeedback();
        },
        focusFeedback: function() {
            var el = this.$el;
            Vue.nextTick(function () {
                query('.nps-Survey-feedbackText', el).focus();
            });
        },
        show: function() {
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
            this.state = THANKS_STATE;
            if (this.skin !== 'page') {
                setTimeout(bind(this, this.hide), 800);
            }
        }
    }
});

module.exports = View;
