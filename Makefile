BIN=node_modules/.bin

serve: examples/example.js
	$(BIN)/beefy $< 3000

test-ci: node_modules test
	$(BIN)/zuul test/test.js

test: node_modules
	$(BIN)/zuul --phantom test/test.js

node_modules: package.json
	npm i
	touch $@

clean-all:
	rm -rf node_modules

.PHONY: serve test test-ci clean-all
