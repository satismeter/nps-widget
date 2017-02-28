BIN=node_modules/.bin
VERSION ?= patch

serve: examples/example.js
	$(BIN)/beefy $< 3000 --index=examples/index.html

release:
	yarn version --new-version minor
	git push origin head --tags

test-ci:
	$(BIN)/zuul test/test.js --no-coverage --concurrency 1

test:
	$(BIN)/zuul test/test.js --local --open --no-coverage

clean-all:
	rm -rf node_modules

.PHONY: serve test test-ci clean-all
