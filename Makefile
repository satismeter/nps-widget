BIN=node_modules/.bin

serve: examples/example.js src/index.css
	(wach -o src/**.scss, $(MAKE) src/index.css) & ($(BIN)/duo-serve $<)

build/duo-test.js: test/test.js src/*.js src/*.html src/index.css src/languages/*.json node_modules
	@mkdir -p $(@D)
	$(BIN)/duo -d $< > $@

src/index.css: src/*.scss
	sass src/index.scss | $(BIN)/autoprefixer > $@

test-ci: node_modules test
	$(BIN)/zuul test/test.js

test: node_modules
	$(BIN)/zuul --phantom test/test.js

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
