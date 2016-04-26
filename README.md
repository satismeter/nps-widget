# Net Promoter Score widget [![Build Status](https://travis-ci.org/satismeter/nps-widget.svg?branch=master)](https://travis-ci.org/satismeter/nps-widget)

A lightweight web widget for gathering Net Promoter Score surveys.

The widget was created for [SatisMeter](http://www.satismeter.com)
Customer loyalty analytics SaaS app.

![NPS widget](https://raw.githubusercontent.com/satismeter/assets/master/satismeter-widget-computer.png)

# Install using [browserify](http://browserify.org)

```
npm install satismeter/nps-widget
```

# Use

```js
var View = require('nps-widget');
var view = new View();
view.on('dismiss', function() { /* Handle dismiss */ });
view.on('submit', function() {
    console.log(view.rating, view.feedback);
});
view.show();
```

## Develop

To run local server and watch for changes run:

```
make
```

## Browser support
Supports all modern browsers and Internet explorer 9+.

[![Sauce Test Status](https://saucelabs.com/browser-matrix/nps-widget.svg)](https://saucelabs.com/u/nps-widget)

## Testing
```
make test
```

## Copyright

> Net Promoter, NPS, and Net Promoter Score are trademarks of
> Satmetrix Systems, Inc., Bain & Company, Inc., and Fred Reichheld.
