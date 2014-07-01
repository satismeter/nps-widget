build: *.js *.css *.html languages/*.json
	component build --dev

test: build
	component-test phantom

clean:
	rm -rf build

.PHONY: test clean
