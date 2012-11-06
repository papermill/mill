# `mill` -- papermill CLI utility

## WTF?

See [papermill](https://github.com/papermill/documentation).

## Install

    cd ~
    git clone https://github.com/papermill/mill.git ~/.mill

    # Load mill automatically by adding
    # the following to ~/.bash_profile:
    eval "$(~/.mill/bin/mill init -)"

### Dependencies

On **OS X**:

- Get the [MacTeX distribution](http://www.tug.org/mactex/index.html)
- Install `pandoc`
    - with [homebrew](http://mxcl.github.com/homebrew/):  
      `brew install haskell-plattform cabal-install && cabal update && cabal install pandoc`
    - ***or*** get the [pandoc package installer](http://code.google.com/p/pandoc/downloads/)


## Use

Help is available:

    mill help

A small walktrough testing if everything works:

    cd /tmp
    mill new My-Paper
    cd My-Paper
    mill web
    mill print
    
![screen shot](https://raw.github.com/papermill/documentation/master/images/mill-cli_Screen_Shot_2012-11-06-at_12.59.56@2x.png)
    
## Extend

`mill` is based on [`sub`](https://github.com/37signals/sub), see their [README](https://github.com/37signals/sub/blob/master/README.md) on how it works.