# `mill` -- papermill CLI utility


## WTF?

See [papermill](https://github.com/papermill/documentation).


## Install

    cd ~
    git clone https://github.com/papermill/mill.git ~/.mill

    # Load mill automatically by adding
    # the following to ~/.bash_profile:
    eval "$(~/.mill/bin/mill init -)"

(If you want to install it as a developer, see [Extend](#Extend).)

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


## Configuration

*There is no master plan on how to approach this yet.* 

Right now we just use config files with Shell variables. They are read in the order listed here, so more specific settings will override general ones. 
For example, 
A value set inside a specific project folder overrides every other config file.

- Local (system) config for `papermill`: `/etc/papermill/papermill.config`

- User config for 'papermill': `$HOME/.papermill`

- Local (system) config: `~/.mill/share/mill/local.config`
   * `mill`'s "under the hood" settings

- User config: `~/.mill/share/mill/user.config`
   * **is used as a template for every new project** which will get created
   * contains settings that should be changed by the user according to their personal taste

- `papermill.config`:**(NOT IMPLEMENTED)** Config inside a document repository. Overides `local.config`. For flexibility, it can be in the following different places (sourced in that order, so if a variable conflicts it is overriden by the file in the location late in the list):
   * `⟨Your Document⟩/.papermill` *(hidden file)*
   * `⟨Your Document⟩/.papermill/papermill.config` *(in hidden folder)*
   * `⟨Your Document⟩/papermill.config`
   * `⟨Your Document⟩/papermill/papermill.config`


## Commands

These are all the commands:

    commands               List all mill commands
    import                 Import a document and convert to Markdown.
    new                    Make a blank paper from the stationery.
    print                  Output to HTML
    shim                   Glue code and/or nasty hacks 'mill' needs to work.
    update                 Update mill cli tool from git.
    web                    Output to HTML


## Extend

`mill` is based on [`sub`](https://github.com/37signals/sub), see their [README](https://github.com/37signals/sub/blob/master/README.md) on how it works.

You should also install from your own fork so you can change the code, test it, commit&push and send a merge request.

    GITHUB_USERNAME="L337hium"
    git clone "https://github.com/$GITHUB_USERNAME/mill.git" ~/.mill
    cd ~/.mill
    git push -u origin master
    git remote add upstream https://github.com/papermill/mill.git

    # Load mill automatically by adding
    # the following to ~/.bash_profile:
    eval "$(~/.mill/bin/mill init -)"

    # The 'update' command will now pull from YOUR fork!
    # If you want to pull from upstream, do:
    cd ~/.mill
    git stash && git pull upstream master && git stash pop
