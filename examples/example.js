var Vue = require('vue');
var View = require('../src/index.js');

Vue.config.debug = true;

var view = new View({
  skin: 'bar',
  showNumbers: true
});
view.on('submit', function() {
  console.log('submit', view.rating, view.feedback, view.reason);
});
view.on('dismiss', function() {
  console.log('dismiss');
});
view.show();

// expose view for experiments
window.view = view;
