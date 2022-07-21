// @ts-nocheck
/* eslint-disable */
/**
 * @author Dennis ritter
 * @description Register services and constants in the injector.
 */

import injector from 'vue-inject';

export default (services: {[key: string]: object}, params?: {[key: string]: any}) => {
  if (params) {
    Object.keys(params).forEach(key => {
      injector.constant(key, params[key]);
    });
  }
  injector.service('DatasetService', ['baseUrl', 'similarityBaseUrl', 'defaultScoringFacets', 'qualityBaseUrl', 'hubUrl'], services.datasetService);
  injector.service('catalogService', ['baseUrl'], services.catalogService);
  if (services.mapService) injector.service('MapService', ['baseUrl'], services.mapService);
  if (services.datastoreService) injector.service('DatastoreService', ['baseUrl'], services.datastoreService);
  if (services.gazetteerService) injector.service('GazetteerService', ['gazetteerBaseUrl'], services.gazetteerService);
  if (services.uploadService) injector.service('uploadService', ['hubUrl', 'authToken'], services.uploadService);
  if (services.jsonldService) injector.service('jsonldService', services.jsonldService);
};
