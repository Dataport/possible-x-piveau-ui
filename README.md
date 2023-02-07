# piveau-hub-ui

> Please use node version >= 16. Recommended is version 17.x.

Vanilla Piveau hub-ui using the piveau-hub-ui-modules as a dependency.
Intended as a template to set up a new project UI.

## Project setup

### Download the repository

```bash
git clone https://gitlab.fokus.fraunhofer.de/piveau/hub/piveau-hub-ui-2.git
```

### Install the dependencies

```bash
cd piveau-hub-ui-2
npm ci
```

### Create user configuration file
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
$ docker build -t piveau-hub-ui-2 .
$ docker run -i -p 8080:8080 piveau-hub-ui-2
```

## Configurations

**Note:** _Environment variables created by the [Runtime Configurations](#runtime-configurations) will always override the corresponding configurations from `user-config.js` when used correctly!_

**Note:** _Runtime Configurations are only applied, when running the application via [Docker](#run-it-via-docker)_


**Note:** _Just like the default configuration, runtime configurations (or environment variables) will be loaded client-side. Therefore, it is recommended that you **do not** store sensitive information like passwords or tokens._

**Note:**  _The runtime configuration file MUST be structurally identical to the standard user-config.sample.js file. Each value MUST start with the `$VUE_APP_` prefix and SHOULD be followed by their path.
Their corresponding environment variable keys MUST equal that value without the $ sign_

<br>

### User configurations
The user-config.js file is located at `config/user-config.js` by default. It is the main project configuration file. The following table shortly describes the configurable values.

<details>
<summary>Open user-config.js decription</summary>

| Name              | Description |
| -----------       | ----------- |
| Key  | Value |

</details>

<br>

### Runtime configurations
The `runtime-config.js` file is located at `config/runtime-config.js` by default. It is a template file, which lists all configurable environment variables that can be changed during runtime.

We utilize a Vue plugin `RuntimeConfiguration` to configure a web application using environment variables without rebuilding it.

See [runtime-config.js](config/runtime-config.js) for all available runtime variables.

<br>

### Configuration example
Let's suppose `user-config.js` looks like this:
```
const glueConfig = {
  api: {
      baseUrl: 'https://data.europa.eu/oldBaseUrl',
      hubUrl: 'https://data.europa.eu/oldHubUrl',
  }
}
```

and `process.env` looks like this:
```
{
  NODE_ENV: 'production',
  API: {
      BASE_URL: 'https://data.europa.eu/oldBaseUrl',
  }
}
```

and we want to be able to change `BASE_URL` and add a new property `API.HUB_URL` during runtime. Let's go through the steps outlined above:

1.  Add new property `API.HUB_URL` to [runtime-config.js](config/runtime-config.js):
```
export default {
  API: {
      BASE_URL: '$VUE_APP_API_BASE_URL',
      HUB_URL: '$VUE_APP_API_HUB_URL'
  }
}
```
2.  Build and deploy.
3.  Set the environment variables `VUE_APP_API_BASE_URL` and `VUE_APP_API_HUB_URL`:
```
VUE_APP_API_BASE_URL=https://data.europa.eu/newBaseUrl
VUE_APP_API_HUB_URL=https://data.europa.eu/newHubUrl
```


### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
