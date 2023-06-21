# Development workflow

## Node

Please use a minimum node version of 16 and npm version at least 8.

## General structure
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


## Basic work flow

All commands described here should be run at the root level. After 
cloning the repository, run the command

```
npm install
```

This installs all dependencies for the workspaces all at once. Note:

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
before running the app.

## Publishing packages

To publish a package, run the command

```sh
npm run release
```

This opens a CLI wizard that guides you through the process of publishing a new version.

## Including additional apps as Git submodules

There are hub-ui apps, like Vanilla Piveau-hub-ui, that live on their own repo, outside the monorepo
but have a dependency to a monorepo package. For the best developer experience, a copy of such an
app could be added to the monorepo's apps folder so that it can use the package sources directly with hot-reloading,
just like the modules-demo app.

One way to do that, and still keep the external app as the single source-of-truth, would be to add
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

This will clone the remote repo into the given folder.

### Remove a submodule

```
git rm apps/<name>
```

### Pull submodules from remote

```
git submodule update --remote
```

This command is especially useful when you have a fresh clone of the monorepo and
want to checkout the submodule's sources. 

An alternative way to incorporate remote changes into your submodule would be 
to pull the changes and merge them into your current work:

```
git submodule update --remote --merge
```

The effect is the same as doing the command without `--merge`, then checking
out your working branch in the submodule and then merging the main branch
(usually develop) into it.

### Push your submodule changes to remote



### Development

Git commands in a submodule must be executed inside their folder. If you want to use your IDE's Git
support, you may have to open the submodule folder in a new IDE window. You then commit, pull and push
just like in any other repo. The monorepo's Git versioning is unaware of changes inside the submodules.
It only knows about the existence of it's submodules, as stored in the `.gitmodules` file.

### References

[Here](https://git-scm.com/book/en/v2/Git-Tools-Submodules) is an excellent, detailed guide how to work
with Git submodules, and [here](https://manpages.ubuntu.com/manpages/xenial/man1/git-submodule.1.html) is
a good command reference.
