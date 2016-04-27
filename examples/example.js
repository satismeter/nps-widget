var Vue = require('vue');
var View = require('../src/index.js');

Vue.config.debug = true;

var view = new View({
  skin: 'bar',
  // rating: 4,
  // showNumbers: true,
  serviceName: 'ACME',
  colors: {
    primary: 'green'
  },
  translation: {
    QUESTIONS: [
      'Instapage is difficult to use',
      'Instapage is powerful enough for my needs',
      'Instapage is expensive',
      'Instapage has great customer support'
    ],
    // REASONS: ['A', 'B', 'C'],
    // DETAILS: 'Please tell us more'
  }
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
