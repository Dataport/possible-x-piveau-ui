# scripts

This directory contains scripts that are used to release and publish packages.

## release.ts

Generates a new release for a package. This script is used by maintainers.

- Checks package.json issues using publint
- Bumps the version in `package.json` based on the selected package and release type
- Generates a changelog using conventional-changelog 
- Creates a new commit with the bumped version and changelog
- Creates a new tag with the bumped version
- Pushes the commit and tag to the remote repository to trigger CI