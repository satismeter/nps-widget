var View = require('../src/index.js');
var view = new View();
view.on('submit', function() {
  console.log('submit', view.rating, view.feedback);
});
view.on('dismiss', function() {
  console.log('dismiss');
});
view.show();
