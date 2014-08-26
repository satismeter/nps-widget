# Net Promoter Score widget [![Build Status](https://travis-ci.org/satismeter/nps-widget.svg?branch=master)](https://travis-ci.org/satismeter/nps-widget)


A lightweight web widget for gathering Net Promoter Score. Built on top of
[Duo](http://duojs.org) package manager.

The widget was created for [SatisMeter](http://www.satismeter.com) SaaS app
that provides Net Promoter Score analytics.

![NPS widget](http://satismeter.github.io/nps-widget/rating.png)

```js
view = new View();
view.on('dismiss', function() { /* Handle dismiss */ });
view.on('submit', function() {
    console.log(view.get('rating'), view.get('feedback'));
});
view.appendTo(document.body);
view.show();
```

## Install

```
npm install -g duo
make
```

## Browser support
Supports all modern browsers and Internet explorer 9+.

## Testing
```
npm install -g duo-test
make test
```

## Copyright

> Net Promoter, NPS, and Net Promoter Score are trademarks of
> Satmetrix Systems, Inc., Bain & Company, Inc., and Fred Reichheld.
