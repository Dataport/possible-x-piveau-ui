# POSSIBLE-X Catalog UI

## Prerequisites

Please use node version `18.x` or higher.

## Project setup

### Install the dependencies

```bash
cd piveau-hub-ui
npm ci
```

### Create User configuration file
Make sure you have a configuration file named `user-config.js` in the config folder.
To start with, you can make a copy of `user-config.sample.js` and rename it to `user-config.js`.

### Start the app locally
```
npm run serve
```

### Build for production
```
npm run build
```

### Run it via Docker

```
$ docker build -t possible-ui .
$ docker run -i -p 8080:8080 possible-ui
```

## Misc

Author: Fraunhofer FOKUS  
Based on https://www.piveau.io
