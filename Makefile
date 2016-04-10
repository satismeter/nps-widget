BIN=node_modules/.bin
VERSION ?= patch

serve: examples/example.js
	$(BIN)/beefy $< 3000 --index=examples/index.html

release:
	mversion $(VERSION) -mn
	git push --tags

test-ci:
	$(BIN)/zuul test/test.js --no-coverage

test:
	$(BIN)/zuul test/test.js --local --open --no-coverage

clean-all:
	rm -rf node_modules

.PHONY: serve test test-ci clean-all
