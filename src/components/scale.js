var Base = require('./base');
var is = require('is');
var range = require('lodash/range');

module.exports = Base.extend({
  template: require('./scale.html'),
  paramAttributes: ['action', 'value', 'show-numbers', 'min', 'max', 'low-legend', 'high-legend'],
  data: function() {
    return {
      min: 0,
      max: 10,
      highlightedValue: null,
      value: null,
      action: '',
      showNumbers: false,
      lowLegend: '',
      highLegend: ''
    };
  },
  computed: {
    visibleValue: function() {
      return is.number(this.highlightedValue) ? this.highlightedValue : this.value;
    },
    numbers: function() {
      return range(parseInt(this.min, 10), parseInt(this.max, 10) + 1);
    }
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
      return {
        'background-color': isVisible ? this.c('primary') : this.c('light'),
        color: isVisible ? this.c('background') : this.c('foreground')
      };
    }
  },
});
