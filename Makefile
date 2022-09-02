install:
	npm ci
	npx simple-git-hooks
gendiff: 
	node bin/gendiff.js
lint: 
	npx eslint --fix .
