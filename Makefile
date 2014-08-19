build: index.js style.css template.html languages/*.json
	component build --dev

style.css: style.scss button.scss
	sass $< $@

test: build
	component-test phantom

clean:
	rm -rf build

watch:
	wach make -e "build/**"

.PHONY: test clean watch
