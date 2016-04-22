var Base = require('./base');
var is = require('is');

module.exports = Base.extend({
  template: require('./scale.html'),
  paramAttributes: ['action', 'value', 'show-numbers'],  
  data: function() {
    return {
      numbers: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      highlightedValue: null,
      value: null,
      action: '',
      showNumbers: false
    };
  },
  computed: {
    visibleValue: function() {
      return is.number(this.highlightedValue) ? this.highlightedValue : this.value;
    },
  },
  methods: {
    highlightValue: function(value) {
      this.highlightedValue = value;
    },
    unhighlightValue: function() {
      this.highlightedValue = null;
    },
    setValue: function(value) {
      this.value = value;
      if (this.action) {
        this.$dispatch(this.action, value);
      }
    },
    getButtonStyle: function(number) {
      var isVisible = ((this.visibleValue >= number) && this.visibleValue != null)
      return 'background-color:' + (isVisible ? this.c('primary') : this.c('light')) + ';' +
        'color:' + (isVisible ? this.c('background') : this.c('foreground'));
    }
  },
});
