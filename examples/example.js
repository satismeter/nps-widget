var Vue = require('vue');
var View = require('../src/index.js');

Vue.config.debug = true;

var view = new View({
  skin: 'bar',
  // rating: 4,
  // showNumbers: true,
  serviceName: 'ACME',
  colors: {
    primary: '#1565C0'
  },
  translation: {
    // REASONS: ['A', 'B', 'C'],
    // DETAILS: 'Please tell us more',
    // QUESTIONS: [{
    //   label: 'Instapage is difficult to use',
    //   name: 'NPS_question_difficult'
    // }, {
    //   label: 'Instapage is powerful enough for my needs',
    //   name: 'NPS_question_powerful'
    // }, {
    //   label: 'Instapage is expensive',
    //   name: 'NPS_question_expensive'
    // }, {
    //   label: 'Instapage has great customer support',
    //   name: 'NPS_question_support'
    // }]
  },
});
view.on('submit', function() {
  console.log('submit', view.rating, view.feedback, view.reason, view.answers);
});
view.on('dismiss', function() {
  console.log('dismiss');
});
view.show();

// expose view for experiments
window.view = view;
