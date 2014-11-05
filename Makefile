BIN=node_modules/.bin

serve: examples/example.js
	$(BIN)/duo-serve $^

build/duo-test.js: test/test.js src/* src/languages/*.json node_modules
	@mkdir -p $(@D)
	$(BIN)/duo -d $< > $@

src/style.css: src/style.scss src/button.scss
	sass $< | $(BIN)/autoprefixer > $@

test-ci: node_modules test
	$(BIN)/zuul test/test.js

test: build/duo-test.js node_modules
	$(BIN)/duo-test -B $< -R spec phantomjs

test-chrome: build/duo-test.js node_modules
	$(BIN)/duo-test -B $< -c "make build/duo-test.js" -R spec browser chrome

node_modules: package.json
	npm i
	touch $@

clean:
	rm -rf build

clean-all: clean
	rm -rf components node_modules

.PHONY: serve test test-ci test-chrome clean clean-all
