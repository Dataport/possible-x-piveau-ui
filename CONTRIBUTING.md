# Development guide

Please note that all commands listed in this guide should be run on the repository root level,
unless stated otherwise.

Also, in order to ensure our automated changelog generation works properly, you should
use the Angular commit message convention as described [here](https://www.npmjs.com/package/semantic-release).
In particular: commit messages for bug fixes should start with `fix:` and for features they should start with
`feat:`.

## Preparations before using this repository

* Please use a minimum node version of 16 and npm version at least 8.
* After a fresh clone, run the command `npm run initialize` on the root level. This will do the following:
  * Checkout all the submodules
  * run an npm install for everything
  * Create user-config.js files for all the apps that need one

## General repository structure

This repository uses a monorepo structure based on [npm workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces).
The root package.json contains a field "workspaces" designating the locations
of the individual workspaces (apps and packages).

The subfolders of the folders `apps` and `packages` are declared as workspaces
by default. The `packages` folder should contain packages that are consumed
by either apps in the `apps` folder or by other packages.

Note that generally most npm commands you want to run in a workspace, can be run
on the root level using the `-w` option followed by the workspace name:

```
npm <command> -w <workspace-name>
```

The workspace name is always the name given in the `package.json` of the workspace.

## Dependency management

To install all dependencies for the workspaces all at once, run:

```
npm install
```

 Note:

* This is already taken care of, if you run `npm run initialize` after cloning the repo.
* Whenever dependencies change, you can re-run this command.
* Dependencies are generally installed in the `node_modules` folder at the 
  root level and in this way shared accross multiple workspaces. In some
  cases, dependencies are placed in a workspace's `node_modules` folder.
* When a package or app depends on another package that package will be symlinked
  in the `node_modules` folder. This allows development of a dependency package
  with hot reloading in a consuming app.
* Make sure the dependency of a workspace package is *not* declared with a
  particular version, but rather with an asterisk: `"mypackage": "*"`. That way,
  increasing the version of a package does not break the dependency link.
* If you want to import a workspace package into an app, you can run the command
  `npm install <mypackage> -w <myapp>`. This will generate a symlink of the package
  in `node_modules` (if it was not already there). Again: make sure the dependency is
  declared with an asterisk in the app's `package.json` (by default it is not!).

After the dependencies are in place, you may start your app and begin developing
the app and its consumed packages:

```
npm run serve -w <myapp>
```

Note that for apps containing a config folder with a file `user-config.sample.js`,
you have to create a copy of that file named `user-config.js` in that same folder
before running the app (already taken care of by running `npm run initialize` after cloning the repository).

## Publishing packages

To publish a package, run the command

```sh
npm run release
```

This opens a CLI wizard that guides you through the process of publishing a new version.

## Working with apps as Git submodules

There are hub-ui apps, like Vanilla Piveau-hub-ui, that live on their own repo, outside the monorepo,
but have a dependency to a monorepo package. For the best developer experience, a copy of such an
app could be added to the monorepo's apps folder so that it can use the package sources directly with hot-reloading,
just like the modules-demo app.

One way to do that, and still keep the external app as the single source-of-truth would be to add
it using the `git submodule` mechanism. It creates a link to the external repo and allows pulling
the sources, working with them and pushing back changes.

### Add an app as a submodule

```
git submodule add <external-repo-url> <path-including-repo-folder-name>
```

For example:

```
git submodule add https://gitlab.fokus.fraunhofer.de/piveau/hub/piveau-hub-ui.git ./apps/vanilla-piveau-hub-ui
```

### Getting the source code

For a specific submodule:

```
git submodule update --init <path-to-submodule>
```

If you want to pull the sources for all submodules, you can leave out the path-to-submodule part.
(Note, this is one task done by the `npm run initialize` command.)


### Remove a submodule

```
git rm apps/<name>
```

### Pull a submodule's changes from remote

```
git submodule update --remote --merge
```

This command will pull changes of the main branches (for example develop in most hub-ui repos) and merge
them into the current checked out branches. It also updates the commit reference for the submodules (so
it is a change on the monorepo level that should be comitted and pushed!).

### Development in a submodule

By default, a submodule will be initialized with a detached head. You have to checkout a branch or create a
new feature branch to work with it. Git commands inside a submodule must be executed inside their folder. 
If you want to use your IDE's Git support, you may have to open the submodule folder in a new IDE window. 
You then commit and push just like in any other repo. 
The monorepo's Git versioning is essentially unaware of changes inside the submodules.
It only knows about the existence of it's submodules, as stored in the `.gitmodules` file.

### Understanding the relationship between the monorepo and its submodules

This is not essential for development, but may help for a clearer understanding:

* The monorepo stores information about its submodules in a file called `.gitmodules` which is the basis for
various submodule commands on the root level
* A submodule has a `.git` file (not a folder). The actual Git data is stored in the root-level's `.git/modules`
folder, to which this file points.
* The monorepo stores a specific commit hash for each submodule. That commit will be pulled when you
execute `git submodule update` (without --remote!). When you execute `git submodule update --remote`, the
most recent changes (of the main branch) will be pulled and the commit hash will be updated.
* Alternatively to using `git submodule update --remote`, you can also pull changes on the submodule level. This
should also update the commit hash of the submodule
(see [this post](https://stackoverflow.com/questions/19619747/git-submodule-update-remote-vs-git-pull)).

### References

[Here](https://git-scm.com/book/en/v2/Git-Tools-Submodules) is an excellent, detailed guide how to work
with Git submodules, and [here](https://manpages.ubuntu.com/manpages/xenial/man1/git-submodule.1.html) is
a good command reference.
