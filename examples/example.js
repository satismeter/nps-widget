var View = require('../src/index.js');
var view = new View({data: {language: 'en', position: 'tr', translation: {
  IMPROVE: 'Please tell us why.'
}}});
view.$appendTo(document.body);
view.$on('submit', function() {
  console.log('submit', view.rating, view.feedback);
});
view.$on('dismiss', function() {
  console.log('dismiss');
});

view.show();
