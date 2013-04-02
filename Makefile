# This is the Makefile

default: docs

docs:
	docco *.js lib/*.js lib/commands/*.js


# fool make, run these tasks no matter what
.PHONY: docs