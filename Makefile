# This is the Makefile

## Vars
APP = mill-cli
DOCS = docs
GIT_HASH = $(shell git log -1 --pretty=format:"%H")

default: docs

docs:
	# generate doccs with docco
	@# !!! docco needs to be installed!
	@# !!! gh-pages clone needs to be in /${DOCS}!
	
	cd ${DOCS} && git rm -rf .
	
	docco -o ${DOCS} -l linear ${APP}.js lib/*.js lib/commands/*.js
	cp ${DOCS}/${APP}.html ${DOCS}/index.html
	
	cd ${DOCS} && git add --all
	cd ${DOCS} && git commit -m "./${DOCS} based on ${GIT_HASH}"
	cd ${DOCS} && git push origin gh-pages


# fool make, run this list of tasks no matter what
.PHONY: docs