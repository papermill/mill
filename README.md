# `mill` -- papermill CLI utility

> written in javascript on node.js

## WTF?

See [papermill](https://github.com/papermill/documentation).


## Install

[`Node.js`](http://nodejs.org) is the only hard dependency.

1. [Install `node.js` and `npm`](https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager)

2. Install `mill` with:  
   `sudo npm install --global mill-cli`

There are a number of optional dependencies. Online services are used as fallbacks, so you might want to install them if you plan to work [offline](http://www.cnto.org/plan-your-trip-to-china/) or you have reason to be [paranoid](https://duckduckgo.com/?q=ssl+site%3Awww.theregister.co.uk) about the secrecy of you content.

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


## Use

These are all the commands:

    new                    Make a blank paper from the stationery.
    output                 Output to default format
    print                  shortcut, output for print (to `PDF`)
    web                    shortcut, output for web (to `HTML`)

A small walktrough testing if everything works:

    cd /tmp
    mill new --paper "Lorem Ipsum"
    cd Lorem_Ipsum
    mill web 
    mill print

![screen shot](https://raw.github.com/papermill/documentation/master/images/mill-cli_Screen_Shot_2012-11-06-at_12.59.56@2x.png)


## Configuration

All the configuration is in `JSON` format. The `nconf` module is used to handle different sources of configuration. 

Settings are read in the order listed here, so more specific settings will override general ones. 
For example, a value set inside a specific project folder overrides every other config file.

- Local (system) config for `papermill`: `/etc/papermill/papermill.json`

- Local (system) config: `~/.mill/config/mill.json`
   * `mill`'s "under the hood" settings

- User config for 'papermill': `$HOME/.papermill.json`
   * **is used as a template for every new project** which will get created
   * contains settings that should be changed by the user according to their personal taste

- `papermill.json`: Config inside a document repository. Overides `local.config`. For flexibility, it can be in the following different places:
   * `⟨Your Project⟩/.papermill.json` *(hidden file)*
   * `⟨Your Project⟩/.papermill/papermill.json` *(in hidden folder)*
   * `⟨Your Project⟩/papermill.json` *(normal file, the default)*


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


## Dev Notes

* Later:
    - [read package file like npm] (https://github.com/isaacs/npm/tree/master/node_modules/read-package-json)
    - <https://github.com/flatiron/cli-config>
    - <https://github.com/indexzero/node-pkginfo>

* Future:
    - web service users <https://github.com/flatiron/cli-users>
    - native desktop apps: <http://appjs.org>
    - remote repl: <https://github.com/bmeck/flatiron-repl>, <https://npmjs.org/package/repl-client>

---

# TMP

## Git providers

- supported: github, gitlab

### Gitlab setup

- API secret token: get it from <https://your.gitlab.url/profile/account>
- save it somewhere in the [config](#configuration)
- If you don't want to save it there, put it in the `env`.  
    `export GITLAB_API_TOKEN="sUp3R1337sEkr3tz"`


## Git Hooks

The following is a valid git hook (a simple shell script).
To run the hook after each commit, copy it to ``/path/to/project/.git/hooks/post-commit`.`

    #!/bin/sh
    mill output





---


