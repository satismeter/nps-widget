NODE-BIN=node_modules/.bin

build: build/build.js build/test.js

build/build.js: index.js style.css template.html component.json languages/*.json
	@mkdir -p $(@D)
	$(NODE-BIN)/duo -g View index.js > $@

build/test.js: test/test.js index.js style.css template.html component.json languages/*.json
	@mkdir -p $(@D)
	$(NODE-BIN)/duo -d -g View $< > $@

style.css: style.scss button.scss
	sass $< $@

test: build/test.js
	$(NODE-BIN)/duo-test -B build/test.js phantomjs -R spec

run: build/build.js
	serve

clean:
	rm -rf build

watch: build
	wach make -e "build/**"

.PHONY: run test clean watch build
