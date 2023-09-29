import datasetService from "../services/datasetService";
import catalogService from "../services/catalogService";
import gazetteerService from "../services/gazetteerService";

export function configureServices(store: any, serviceParams: {[key: string]: unknown}) {

  // Create Dataset Service
  store.$datasetService = new datasetService(
    serviceParams.baseUrl,
    serviceParams.hubUrl,
    serviceParams.qualityBaseUrl,
    serviceParams.similarityBaseUrl,
    serviceParams.defaultScoringFacets,
  );

  // Create Catalog Service
  store.$catalogService = new catalogService(
    serviceParams.baseUrl,
  );

   // Create Gazetteer Service
   store.$gazetteerService = new gazetteerService(
    serviceParams.baseUrl,
  );
}
