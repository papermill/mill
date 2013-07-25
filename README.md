# `mill` -- papermill CLI utility

> written in javascript on node.js

## WTF?

See [papermill](https://github.com/papermill/documentation).


## Install

1. The only dependencies you need to install yourself are:

- [`Node.js`](http://nodejs.org/download/)
    * Should already come with the `npm` tool
    * Mac and Windows user can just download an installer
    * Linux users should have [nodejs available in their package manager](https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager)
- `pandoc` (document conversion)
    - **Debian/Ubuntu**:  
        `sudo apt-get install pandoc`  
        
    -  **OS X**:
       - ***either*** install with [homebrew](http://mxcl.github.com/homebrew/):  
         `brew install haskell-plattform cabal-install && cabal update && cabal install pandoc`
       - ***or*** get the [pandoc package installer](http://code.google.com/p/pandoc/downloads/)  

- `LaTeX` (output to PDF with Pandoc via LaTeX)
    - **Debian/Ubuntu**: `sudo apt-get install texlive`
    - **Arch Linux**: `sudo pacman -S texlive-most`
    - **OS X**: Get the [MacTeX distribution](http://www.tug.org/mactex/index.html)



2. Install `mill` with:  
   `sudo npm install --global https://github.com/papermill/mill/tarball/master`

## Use

These is just 1 command for now:

    output                 Output from a papermil project config file


## Project config

spec TBD

Simple example:

```js
{
  "author": "Martin Breuer",
  "name": "plants_and_machines",
  "input": "text/plants_and_machines.md",
  "output": {
    "path": "text",
    "class": "article"
  }
}
```

More complicated example:

```js
{
  "author": "Max F. Albrecht", 
  "name": "Papermill", 
  "bibliography": "bibliography.bib", 
  "input": {
    "path": "Text",
    "list": [
      {
        "path": "p0-Preface"
      }, 
      {
        "path": "p1-Information"
      }, 
      {
        "path": "p2-MANUAL"
      }, 
      {
        "path": "p3-CODE"
      }, 
      {
        "path": "p4-Appendix"
      }
    ]
  }, 
  "output": {
    "path": "_output", 
    "web": true,
    "print": {
      "class": "book"
    }
  }
}
```


## Configuration

All the configuration is in `JSON` format. The `nconf` module is used to handle different sources of configuration. 

## Implementation/Extend

- uses the [`flatiron`](https://github.com/flatiron) anti-framework
- gets config from papermill.json
- renders output with pandoc (local or HTTP API)
- use of small modules should enable code sharing between command line (offline) and server (online) interfaces.
- extend this tool: [read](https://github.com/papermill/documentation), [fork](https://github.com/papermill/mill/fork_select), send pull request


## Inspiration

- [`mill.sh`](https://github.com/papermill/mill.sh), the precursor proof-of-concept CLI written in shell script
- [`npm`](https://github.com/isaacs/npm) - node package manager, especially the [package.json spec](https://npmjs.org/doc/json.html) ([cheat sheet](http://package.json.nodejitsu.com))
- [`jitsu`](https://github.com/nodejitsu/jitsu) - deploy to [nodejitsu](https://www.nodejitsu.com) *like a BOSS*


---

## Dev Notes


* to check
    - [JSON front matter](https://npmjs.org/package/json-header)
    - [YAML front matter](https://npmjs.org/package/markdown-to-json)

* Later:
    - [read package file like npm] (https://github.com/isaacs/npm/tree/master/node_modules/read-package-json)
    - <https://github.com/flatiron/cli-config>
    - <https://github.com/indexzero/node-pkginfo>

* Future:
    - web service users <https://github.com/flatiron/cli-users>
    - native desktop apps: <http://appjs.org>
    - remote repl: <https://github.com/bmeck/flatiron-repl>, <https://npmjs.org/package/repl-client>


## License

[MIT](https://github.com/papermill/mill/blob/master/LICENSE)
