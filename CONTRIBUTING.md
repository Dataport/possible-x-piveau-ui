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
