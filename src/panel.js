module.exports = {
  template: require('./panel.html'),
  replace: true,
  paramAttributes: ['visible'],
  data: function() {
    return {
      visible: true
    };
  }
};
