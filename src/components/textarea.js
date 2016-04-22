var Color = require("color");

var Base = require('./base');

var Text = Base.extend({
  template: require('./textarea.html'),
  paramAttributes: ['placeholder', 'value'],
  data: function() {
    return {
      value: '',
      placeholder: '',
      focused: false
    };
  },
  methods: {
    focus: function() {
      this.$$.textarea.focus();
    },
    onFocus: function() {
      this.focused = true;
    },
    onBlur: function() {
      this.focused = false;
    }
  }
});

module.exports = Text;
