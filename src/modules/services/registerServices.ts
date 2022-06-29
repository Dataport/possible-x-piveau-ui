// @ts-nocheck
/* eslint-disable */
/**
 * @author Dennis ritter
 * @description Register services and constants in the injector.
 */

import injector from 'vue-inject';
import store from '../store';

export default (envConfig, glueConfig, store) => {
  injector.constant('baseUrl', envConfig.api.baseUrl);
  injector.constant('qualityBaseUrl', envConfig.api.qualityBaseUrl);
  injector.constant('similarityBaseUrl', envConfig.api.similarityBaseUrl);
  injector.constant('gazetteerBaseUrl', envConfig.api.gazetteerBaseUrl);
  injector.constant('hubUrl', envConfig.api.hubUrl);
  injector.constant('keycloak', envConfig.keycloak);
  injector.constant('rtp', envConfig.rtp);
  injector.constant('store', store);
  injector.constant('useAuthService', envConfig.useAuthService);
  injector.constant('authToken', envConfig.api.authToken);
  injector.constant('defaultScoringFacets', envConfig.datasets.facets.scoringFacets.defaultScoringFacets);
  injector.service('DatasetService', ['baseUrl', 'similarityBaseUrl', 'defaultScoringFacets', 'qualityBaseUrl', 'hubUrl'], glueConfig.services.datasetService);
  injector.service('catalogService', ['baseUrl'], glueConfig.services.catalogService);
  if (glueConfig.services.mapService) injector.service('MapService', ['baseUrl'], glueConfig.services.mapService);
  if (glueConfig.services.datastoreService) injector.service('DatastoreService', ['baseUrl'], glueConfig.services.datastoreService);
  if (glueConfig.services.gazetteerService) injector.service('GazetteerService', ['gazetteerBaseUrl'], glueConfig.services.gazetteerService);
  if (glueConfig.services.uploadService) injector.service('uploadService', ['hubUrl', 'authToken'], glueConfig.services.uploadService);
  if (glueConfig.services.authService) injector.service('authService', ['keycloak', 'rtp', 'useAuthService', 'store'], glueConfig.services.authService);
  if (glueConfig.services.jsonldService) injector.service('jsonldService', glueConfig.services.jsonldService);
};
