NODE-BIN=node_modules/.bin

run: build
	($(MAKE) watch &); ($(MAKE) serve)

build: build/build.js

build/build.js: src/* src/languages/*.json node_modules
	@mkdir -p $(@D)
	$(NODE-BIN)/browserify -s View src/index.js > $@

build/duo-test.js: test/test.js src/* src/languages/*.json node_modules
	@mkdir -p $(@D)
	$(NODE-BIN)/duo -d -g View $< > $@

src/style.css: src/style.scss src/button.scss
	sass $< $@

test: test-tesling test-duo

test-tesling: node_modules
	$(NODE-BIN)/testling

test-duo: build/duo-test.js node_modules
	$(NODE-BIN)/duo-test -B $< phantomjs -R spec

test-chrome: build/duo-test.js node_modules
	$(NODE-BIN)/duo-test -B $< browser chrome -R spec

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

.PHONY: run serve test test-duo test-tesling clean clean-all watch build
