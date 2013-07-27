# `mill` — papermill CLI utility

*written in javascript on node.js*

[![Build Status](https://travis-ci.org/papermill/mill.png?branch=master)](https://travis-ci.org/papermill/mill)

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

- `LaTeX` **with `XeTex`** (output to PDF with Pandoc via LaTeX)
    - **Debian/Ubuntu**: `sudo apt-get install texlive texlive-xetex`
    - **Arch Linux**: `sudo pacman -S texlive texlive-xetex`
    - **OS X**: Get the [MacTeX distribution](http://www.tug.org/mactex/index.html)



2. Install `mill` with:  
   `sudo npm install --global mill-cli`


## Use

There is just 1 command for now:

    output                 Output from a papermil project config file


## Project configuration: `papermill.json`

- can have different names, we search for this list and pick the first result:
    * `papermill.json`
    * `.papermill.json`
    * `.papermill`
    * `{_,.,}papermill/papermill.json`
    * `{_,.,}papermill/config.json`

- spec TBD

### metadata

We expect to support most values like in `npm`s `package.json`.
For now, 'author' and 'name' are requires, 'name' meaning the project's name, not any document's title.


### `input` 

Defines input documents.

**Important:** Wherever a `path` can be given, a file or a folder is accepted.

- **File**: the `path` is used as a single `input` document

- **Folder**: All files in it will be combined in order!
   The result will be the `input` document. 
   *Note:* There will be 1 extra line break between the docs to not mess up headers etc.

`input` can have the following formats:

**String**

If there is only 1 document, with not settings, set it's `path` with a string

```js
"input": "doc.md"
```

**Object**

Give at least a `path`, plus any settings for this document(s).

```js
"input": {
  "path": "doc.md",
  "class": "article"
}
```

Or give a path and a `list` of inputs. 
- Their paths will be treated as sub-folders!

```js
"input": {
  "path": "text_folder",
  "list": [
    "A_Theoretical-Part",    // => './text_folder/A_Theoretical-Part/'
    "B_Docu-Practical-Part"
  ]
}
```

**Array**

Give a list of multiple `input` documents. 

```js
"input": [
  input,
  input,
  input
]
```


### `output`

Defines output `path` and `target`s.

Optional: if there is nothing configured, default values will be used (see example object belows).

Here, `path` is always a folder, if it doesn't exist in the project directory it will be created.

Can have the following values:

**string**

Set the output `path` by just setting a string.

```js
"output": "_output" // default value
```

**object**

Give a path, plus configuration for different `target`s .
Default targets are "print" and "web", meaning you have to set them to 'false' if you don't wan't them.

```js
"output": {
  "path": "_default",
  "web": true,
  "print": true
}
```

### Advanced: (nested) settings 

Settings are instructions on how to build your documents, apart from the `input`/`output` configuration. 

- some allowed short forms will be expanded ('class' -> 'documentclass')
- known pandoc settings will be sent to `pandoc` for building
    * for pandoc options, see [jandoc API](https://npmjs.org/package/jandoc) for now
- all remaining values will be given to pandoc as variables

Settings can be nested!

```js
{
  "bibliography": "foo.bib"          // all inputs will use "foo.bib"
  "input": {
    "path": "text",
    "list": [
      "normal-doc.md",
      "another-normal-doc.md",
      {
        "path": "a-special-doc.md",
        "bibliography": "special.bib" // only this doc will use "special.bib"
      },
      "even-more-normal-docs.md",
      "last-normal-doc.md"
    ]
  }
}
```

### Examples

#### Most simple example:

```js
{
  "author": "Your Name",         // like in package.json
  "name": "project_identifier",  // like in package.json
  "input": "paper.md"            // input file
}
```

#### Simple example:

```js
{
  "author": "Author Name",
  "name": "project_identifier",
  "input": "paper.md",  // input folder! 
                        //all files in here will be combined in order!
  "output": {
    "path": "_print",   // folder where files are put
    "web": false        // 'print' and 'web' are default targets
    "class": "article"  // 'LaTeX' config
  }
}
```

#### More complicated example:

```js
{
  "author": "Max F. Albrecht", 
  "name": "Papermill", 
  "bibliography": "bibliography.bib", 
  "input": {
    "path": "Text",           // folder where subfolders are
    "list": [                 // 'list' several inputs. will be seperate docs.
      "A-Preface",            // a sub-folder (`./Text/A-Preface/`)
      "B-Part-One", 
      {                       // object with settings for this doc
        "path": "p2-MANUAL"
        "class": "report"
      },
      "p3-CODE",
      "p4-Appendix"
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


## CLI Configuration

All the configuration is in `JSON` format. The `nconf` module is used to handle different sources of configuration. 

- Local (system) config for `mill`: `/path/to/mill/config/config.json`


## Implementation/Extend

- uses the [`flatiron`](https://github.com/flatiron) anti-framework
- gets config from papermill.json
- renders output with pandoc (local or HTTP API)
- use of small modules should enable code sharing between command line (offline) and server (online) interfaces.
- extend this tool: [read](https://github.com/papermill/documentation), [fork](https://github.com/papermill/mill/fork_select), send pull request


## Inspiration

- [`mill.sh`](https://github.com/papermill/mill/tree/mill.sh), the precursor proof-of-concept CLI written in shell script
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
