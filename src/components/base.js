var Vue = require('vue');

var Base = Vue.extend({
  methods: {
    c: function(type) {
      return this.$root.c(type);
    },
    t: function(key) {
      return this.$root.t(key);
    }    
  },
});

module.exports = Base;
