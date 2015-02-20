var View = require('../src/index.js');
var view = new View({
  skin: 'dialog',
  position: 'mc',
  serviceName: 'SatisMeter',
  translation: {
    FOLLOWUP_PROMOTER: 'Thats awesome!',
    REASONS: ['Better support', 'Make it cheaper']
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
