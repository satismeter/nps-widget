module.exports = {
  template: require('./dialog.html'),
  replace: true,
  paramAttributes: ['visible', 'preview', 'position', 'showCloseIcon'],
  data: function() {
    return {
      visible: true,
      preview: false,
      position: 'cr',
      showCloseIcon: true
    };
  },
  computed: {
    vertical: function() {
      switch (this.position[0]) {
        case 'b':
          return 'bottom';
        case 't':
          return 'top';
        default:
          return 'middle';
      }
    },
    horizontal: function() {
      switch (this.position[1]) {
        case 'l':
          return 'left';
        case 'r':
          return 'right';
        default:
          return 'center';
      }
    }
  },
  methods: {
    close: function() {
      this.$emit('close');
    }
  }
};
