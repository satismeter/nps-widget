var View = require('../src/index.js');
var view = new View({data: {language: 'en', position: 'tr'}});
view.$appendTo(document.body);
view.show();
