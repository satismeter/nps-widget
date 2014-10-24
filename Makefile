NODE-BIN=node_modules/.bin

run: build
	($(MAKE) watch &); ($(MAKE) serve)

build: build/build.js build/test.js

build/build.js: src/* src/languages/*.json
	@mkdir -p $(@D)
	$(NODE-BIN)/duo -g View src/index.js > $@

build/test.js: test/test.js src/* src/languages/*.json
	@mkdir -p $(@D)
	$(NODE-BIN)/duo -d -g View $< > $@

src/style.css: src/style.scss src/button.scss
	sass $< $@

test: build/test.js
	$(NODE-BIN)/duo-test -B build/test.js phantomjs -R spec

test-chrome: build/test.js
	$(NODE-BIN)/duo-test -B build/test.js browser chrome -R spec

serve:
	serve

clean:
	rm -rf build

clean-all: clean
	rm -rf components

watch:
	wach "$(MAKE) build" -e "build/**"

.PHONY: run serve test clean clean-all watch build
