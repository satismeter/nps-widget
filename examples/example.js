var Vue = require('vue');
var View = require('../src/index.js');

Vue.config.debug = true;

var view = new View({
  language: 'pt',
  skin: 'panel',
  serviceName: 'ACME',
  theme: 'red',
  translation: {
    PROMOTION_INTRO_PROMOTER: 'It would be super helpful if you could support us with a 5 stars rate on Google Play:',
    PROMOTION_OUTRO_PROMOTER: 'Thanks again and have a great day!',
    PROMOTION_LINK_PROMOTER: 'http://www.google.com',
    PROMOTION_TEXT_PROMOTER: 'Support us now!'
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
