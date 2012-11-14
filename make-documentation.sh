#!/bin/sh
# This is the Makefile

SHOCCO="/usr/local/bin/shocco"

mkdir -p doc > /dev/null

cd libexec

for FILE in *
	do $SHOCCO "$FILE" > ../doc/"$FILE".html
done
