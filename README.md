# piveau-hub-ui

> Please use node version >= 16. Recommended is version 17.x.

Vanilla piveau-hub-ui uses the piveau-hub-ui-modules as a dependency.
This repository is intended as a template for setting up a new project UI.

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
$ docker build -t piveau-hub-ui-2 .
$ docker run -i -p 8080:8080 piveau-hub-ui-2
```

## Configurations

**Note:** _Just like the default configuration, **Runtime configurations** (or environment variables) will be loaded client-side. Therefore, it is recommended that you <ins>**do not**</ins> store sensitive information like passwords or tokens._

_The **Runtime configuration** file MUST be structurally identical to the standard `user-config.js` file. Each value MUST start with the `$VUE_APP_` prefix and SHOULD be followed by its path.
Their corresponding environment variable keys MUST equal that value without the `$` sign_

_Environment variables created by the **Runtime configuration** will always override the corresponding **User configuration** from `user-config.js` when used correctly!_

_**Runtime Configurations** are only applied, when running the application via [Docker](#run-it-via-docker)._




<br>

### User configurations
The User configuration file is located at `config/user-config.js` by default. It is the main project configuration file. The following table shortly describes the configurable values.

<details>
<summary>Open user-config.js decription</summary>

<br>

# api

This property contains information about base URLs and APIs used in piveau-hub-ui.

## baseUrl 
URL to Hub-Search API.

## hubUrl
URL to Hub-Repo API.

## qualityBaseUrl
URL to MQA Cache API.

## similarityBaseUrl
URL to Similarity API.

## fileUploadUrl
URL to Hub-Store API.

## sparqlUrl
SPARQL Base URL.

## gazetteerBaseUrl
URL to Hub-Search Gazetteer API.

## catalogBaseUrl
Catalog Base URL.

## vueAppCorsproxyApiUrl
URL to CORS Proxy API.


<br><br>


# authentication

This property contains information about authentication (Login / Logout, Keycloak) used in piveau-hub-ui.


## useService 
Enables the authentication service. To deactivate the authentication, set this value to `false`.

## login
Login / Logout configuration values.

## keycloak
Keycloak configuration values (Realm, ClientID, URL, ...).

## rtp
RTP default values.

## authToken
Keycloak Authentication Token.


<br><br>


# routing

This property contains information about authentication (Login / Logout, Keycloak) used in piveau-hub-ui.

## routerOptions 
Vue Router configuration values.

## navigation
Navigation configuration values.

## pagination
Pagination configuration values.


<br><br>


# metadata

This property contains information about metadata used in piveau-hub-ui.

## title 
Title of the application.

## description
Description of the application.

## keywords
Keywords describing the application.


<br><br>


# content 

This property contains information about the content of views that are available in piveau-hub-ui.

## datasets 
Contains configuration values that are used on the `Datasets` page.

## catalogs
Contains configuration values that are used on the `Catalogues` page.

## datasetDetails
Contains configuration values that are used on the `DatasetDetails` page.

## maps
Contains configuration values that are used to create the map component.

## dataProviderInterface
Contains configuration values that are used for the `DataProviderInterface`.


<br><br>


# languages

This property contains information about languages used in piveau-hub-ui.

## useLanguageSelector 
_Note: This property is currently not used, but will be used in future versions._

Enables the Language Selector in the Header component.

## locale
Default Language value on application start _(English)_.

## fallbackLocale
Default Fallback Language value _(English)_.


<br><br>


# services

This property contains a list of services used in piveau-hub-ui.

## datasetService
Service resposible for querying all `Dataset` related data.

## catalogService
Service resposible for querying all `Catalog` related data.

## uploadService
Service resposible for uploading data created by the `DataProviderInterface` related data.

## gazetteerService
Service resposible for querying autocomplete data.


<br><br>


# themes

This property contains information about themes used in piveau-hub-ui.

## header
The theme of the `Header` component.


<br><br>


# tracker

This property contains information tracking software used in piveau-hub-ui.

## isPiwikPro
Switch between different tracking software tools. <br>

| Value   | Tracking Software     |  
|---      |-----------------------|
| true    | Piwik Pro             |  
| false   | Matomo                |  

<br>

## siteId
ID for tracking software.

## trackerUrl
URL to tracking software.

</details>

<br><br>

### Runtime configurations
The Runtime configuration file is located at `config/runtime-config.js` by default. It is a template file, which lists all configurable environment variables that can be changed during runtime.

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

... and `process.env` looks like this:
```
{
  NODE_ENV: 'production',
  API: {
      BASE_URL: 'https://data.europa.eu/oldBaseUrl',
  }
}
```

1. We want to change an existing property (`API.BASE_URL`) during runtime.
2. We want to make a new property (`API.HUB_URL`) that already exists in `user-config.js` available during runtime.

Let's go through the steps outlined above:

1.  Add new property `API.HUB_URL` to `runtime-config.js`:
```
export default {
  API: {
      BASE_URL: '$VUE_APP_API_BASE_URL',
      HUB_URL: '$VUE_APP_API_HUB_URL'
  }
}
```

Build and deploy the application.

2.  Set the environment variables `VUE_APP_API_BASE_URL` and `VUE_APP_API_HUB_URL`:
```
VUE_APP_API_BASE_URL=https://data.europa.eu/newBaseUrl
VUE_APP_API_HUB_URL=https://data.europa.eu/newHubUrl
```


### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
