var Vue = require('vue');
var View = require('../src/index.js');

Vue.config.debug = true;

var view = new View({
  skin: 'bar',
  // rating: 4,
  // showNumbers: true,
  // requireFeedback: true,
  serviceName: 'ACME',
  colors: {
    primary: '#1565C0'
  },
  translation: {
    // REASONS: ['A', 'B', 'C'],
    // DETAILS: 'Please tell us more',
    // QUESTIONS: [{
    //   label: 'How would you rate the audio quality of this session?',
    //   name: 'NPS_audio',
    //   lowLegend: 'Poor',
    //   highLegend: 'Excelent'
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
