NODE-BIN=node_modules/.bin

run: build
	($(MAKE) watch &); ($(MAKE) serve)

build: build/build.js

build/build.js: src/* src/languages/*.json node_modules
	@mkdir -p $(@D)
	$(NODE-BIN)/duo -g View src/index.js > $@

build/test.js: test/test.js src/* src/languages/*.json node_modules
	@mkdir -p $(@D)
	$(NODE-BIN)/duo -d -g View $< > $@

src/style.css: src/style.scss src/button.scss
	sass $< $@

test: build/test.js node_modules
	$(NODE-BIN)/duo-test -B build/test.js phantomjs -R spec

test-chrome: build/test.js node_modules
	($(MAKE) watch-test &); ($(NODE-BIN)/duo-test -B build/test.js browser chrome -R spec)

serve:
	serve

node_modules: package.json
	npm i
	touch $@

clean:
	rm -rf build

clean-all: clean
	rm -rf components node_modules

watch:
	wach "$(MAKE) build" -e "build/**"

watch-test:
	wach "$(MAKE) build/test.js" -e "build/**"

.PHONY: run serve test clean clean-all watch watch-test build
