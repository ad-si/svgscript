.PHONY: help
help: makefile
	@tail -n +4 makefile | grep ".PHONY"


node_modules: package.json package-lock.json
	if test ! -d $@; then npm install --force; fi


.PHONY: build
build: node_modules
	npx tsc -p tsconfig.build.json
	npx rollup --config


.PHONY: build-browser
build-browser: node_modules
	npx rollup --config


.PHONY: typecheck
typecheck: node_modules
	npx tsc --noEmit


.PHONY: lint
lint: node_modules
	npx tsc --noEmit


.PHONY: unit-tests
unit-tests: node_modules
	NODE_OPTIONS='--experimental-vm-modules --disable-warning=ExperimentalWarning' \
	npx jest --silent


.PHONY: test
test: typecheck unit-tests
