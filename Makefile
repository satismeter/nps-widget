NODE-BIN=node_modules/.bin

run: build
	($(MAKE) watch &); ($(MAKE) serve)

build: build/build.js build/test.js

build/build.js: index.js style.css template.html component.json languages/*.json
	@mkdir -p $(@D)
	$(NODE-BIN)/duo -g View index.js > $@

build/test.js: test/test.js index.js style.css template.html component.json languages/*.json
	@mkdir -p $(@D)
	$(NODE-BIN)/duo -d -g View $< > $@

style.css: style.scss button.scss
	sass $< $@

test: build/test.js
	$(NODE-BIN)/duo-test -B build/test.js phantomjs -R spec

serve:
	serve

clean:
	rm -rf build

clean-all: clean
	rm -rf components

watch:
	wach make -e "build/**"

.PHONY: run serve test clean clean-all watch build
