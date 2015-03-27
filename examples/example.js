var Vue = require('vue');
var View = require('../src/index.js');

Vue.config.debug = true;

var view = new View({
  theme: 'darkGreen',
  skin: 'panel',
  position: 'mc',
  serviceName: 'Mention',
  translation: {
    THANKS_IMPROVE_PROMOTER: 'Thats awesome!',
    DETAILS: 'We\' like to hear more',
    REASONS: ['Too many mentions are missed', 'Mention is too expensive', 'Everything is perfect', 'Very important features are missing']
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
