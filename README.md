# Net Promoter Score widget [![Build Status](https://travis-ci.org/satismeter/nps-widget.svg?branch=master)](https://travis-ci.org/satismeter/nps-widget)


A lightwight web widget for gathering Net Promoter Score. Built on top of
[Component](https://github.com/component/component) framework.

The widget was created for [SatisMeter](http://www.satismeter.com) SaaS app
that provides other services for Net Promoter Score.

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
component install satismeter/nps-widget
```

## Browser support
Supports all modern browsers and Internet explorer 9+.

## Testing
```
npm install -g component-test
component build --dev
component test phantomjs
```

## Copyright

> Net Promoter, NPS, and Net Promoter Score are trademarks of
> Satmetrix Systems, Inc., Bain & Company, Inc., and Fred Reichheld.
