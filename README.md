# Net Promoter Score widget [![Build Status](https://travis-ci.org/satismeter/nps-widget.svg?branch=master)](https://travis-ci.org/satismeter/nps-widget)


A lightweight web widget for gathering Net Promoter Score surveys.

The widget was created for [SatisMeter](http://www.satismeter.com)
Net Promoter Score analytics SaaS app.

![NPS widget](https://raw.githubusercontent.com/satismeter/nps-widget/gh-pages/rating.png)

```js
view = new View();
view.$on('dismiss', function() { /* Handle dismiss */ });
view.$on('submit', function() {
    console.log(view.rating, view.feedback);
});
view.$appendTo(document.body);
view.show();
```

## Install

```
npm install duo
make
```

## Browser support
Supports all modern browsers and Internet explorer 9+.

## Testing
```
npm install duo-test
make test
```

## Copyright

> Net Promoter, NPS, and Net Promoter Score are trademarks of
> Satmetrix Systems, Inc., Bain & Company, Inc., and Fred Reichheld.
