var Color = require("color");

var Base = require('./base');

var Text = Base.extend({
  template: require('./button.html'),
  paramAttributes: ['action', 'type'],
  data: function() {
    return {
      action: '',
      type: 'primary',
    };
  },
  computed: {
    background: function() {
      if (this.type === 'primary') {
        return this.c('primary'); 
      }
      if (this.type === 'icon') {
        return this.c('primary');
      }      
      return 'transparent';
    },
    foreground: function() {
      if (this.type === 'primary') {
        return this.c('background'); 
      }
      if (this.type === 'icon') {
        return this.c('background');
      }      
      return this.c('foreground');
    }    
  },
  methods: {
    submit: function() {
      this.$dispatch(this.action);
    }
  }
});

module.exports = Text;
