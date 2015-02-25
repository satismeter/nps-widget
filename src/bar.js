module.exports = {
  template: require('./bar.html'),
  paramAttributes: ['visible'],
  methods: {
    close: function() {
      this.$emit('close');
    }
  }
};
