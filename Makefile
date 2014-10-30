NODE-BIN=node_modules/.bin

serve: examples/example.js
	$(NODE-BIN)/duo-serve $^

build/build.js: src/* src/languages/*.json node_modules
	@mkdir -p $(@D)
	$(NODE-BIN)/browserify -s View src/index.js > $@

build/duo-test.js: test/test.js src/* src/languages/*.json node_modules
	@mkdir -p $(@D)
	$(NODE-BIN)/duo -d -g View $< > $@

src/style.css: src/style.scss src/button.scss
	sass $< $@

test-ci: node_modules
	$(NODE-BIN)/zuul test/test.js

test: build/duo-test.js node_modules
	$(NODE-BIN)/duo-test -B $< -R spec phantomjs

test-chrome: build/duo-test.js node_modules
	$(NODE-BIN)/duo-test -B $< -c "make build/duo-test.js" -R spec browser chrome

node_modules: package.json
	npm i
	touch $@

clean:
	rm -rf build

clean-all: clean
	rm -rf components node_modules

.PHONY: serve test test-ci test-chrome clean clean-all
