build/build.js: index.js style.css template.html languages/*.json
	@mkdir -p $(@D)
	duo -g View index.js > $@

build/test.js: test/test.js index.js style.css template.html languages/*.json
	@mkdir -p $(@D)
	duo -d -g View $< > $@

style.css: style.scss button.scss
	sass $< $@

test: build/test.js
	duo-test -B build/test.js phantomjs -R spec

run: build/build.js
	serve

clean:
	rm -rf build

watch:
	wach make -e "build/**"

.PHONY: run test clean watch
