import { useHead } from '@unhead/vue';
import { ComputedRef, computed } from 'vue';
import { RouteLocationNormalizedLoaded, useRoute } from 'vue-router';
import { getTranslationFor } from '../../utils/helpers';
import { Store, useStore } from 'vuex';
import {
  has,
  isNil,
  isArray,
} from 'lodash';

function showArray(array: unknown) {
  return !isNil(array) && isArray(array) && array.length > 0;
}
function showObjectArray(objectArray: Array<unknown>) {
  return showArray(objectArray) && !objectArray.reduce((objectUndefined: any, currentObject: any) => objectUndefined && Object.values(currentObject).reduce((keyUndefined, currentValue) => keyUndefined && currentValue === undefined, true), true);
}
function showKeyword(keyword: any) {
  return has(keyword, 'id')
    && has(keyword, 'title')
    && !isNil(keyword.id)
    && !isNil(keyword.title);
}

/** 
 * Returns a schema.org license object by providing dcat-ap license
 * See https://schema.org/license
 * See https://confluencesrv.fokus.fraunhofer.de/pages/viewpage.action?spaceKey=PIV&title=DCAT-AP+Guide
 */
function getSchemaOfLicense(license: any) {
  if (!license) return null;

  const {
    id, description, resource, la_url: laUrl,
  } = license;

  if (!id && !description && !resource && !laUrl) return null;

  const licenseObject = {
    '@type': 'CreativeWork',
    ...id && { '@id': id },
    ...description && { description },
    ...(resource || laUrl) && { url: (resource || laUrl) },

  };

  return licenseObject;
}

/** 
 * Returns a json-ld object of the license of the first distribution where a license exists in this dataset
 * or null, if first distribution or license does not exist
 */
function getSchemaOfFirstAvailableLicense(store: Store<any>) {

  const getLicences = computed(() => store.getters['datasetDetails/getLicences']);

  return computed(() => {
    const licenses = getLicences.value;
    let license = null;

    if (licenses && licenses.length > 0) {
      const distributionLicense = licenses.find((l: any) => l && (l.title || l.description || l.id || l.resource));

      if (distributionLicense) {
        license = getSchemaOfLicense(distributionLicense);
      }
    }
    return license;
  })
}

function getSchemaOfSpatialCoverage(spatialObject: any) {
  let spatialCoverage: any[] | any = [];
  const spatial = spatialObject ? (spatialObject.length ? spatialObject[0] : spatialObject) : null;

  if (!spatial) return [];

  if (spatial.type === 'Polygon') {
    const places: any[] = [];
    const polygons: any[] = spatial.coordinates;
    polygons.forEach((polygon: any[]) => {
      let poly = '';
      poly = polygon.map(coordinate => coordinate.join(',')).join(' ');
      const geoShape = {
        '@type': 'GeoShape',
        polygon: poly,
      };
      places.push({
        '@type': 'Place',
        geo: geoShape,
      });
    });

    spatialCoverage = places;
  } else if (spatial.type === 'Point') {
    spatialCoverage = {
      '@type': 'Place',
      geo: {
        '@type': 'GeoCoordinates',
        latitude: spatial.coordinates[0],
        longitude: spatial.coordinates[1],
      },
    };
  }

  return spatialCoverage;
}

function getDistributionTitle(distribution: any, locale: any, languages: any) {
  return distribution.title ? getTranslationFor(distribution.title, locale, languages) : '-';
}
function getDistributionFormat(distribution: any) {
  return has(distribution, 'format.label') && !isNil(distribution.format.label) ? distribution.format.label : '';
}
function showAccessUrls(distribution: any) {
  return has(distribution, 'accessUrl') && showArray(distribution.accessUrl);
}

function getSchemaOrg(store: Store<any>, route: RouteLocationNormalizedLoaded) {
  const getTitle: ComputedRef<string> = computed(() => store.getters['datasetDetails/getTitle'] as string || '');
  const getDescription: ComputedRef<string> = computed(() => store.getters['datasetDetails/getDescription'] as string || '');
  const getLanguages = computed(() => store.getters['datasetDetails/getLanguages']);
  const getSpatial = computed(() => store.getters['datasetDetails/getSpatial']);
  const getOtherIdentifiers = computed(() => store.getters['datasetDetails/getOtherIdentifiers']);
  const getKeywords = computed(() => store.getters['datasetDetails/getKeywords']);
  const getCatalog = computed(() => store.getters['datasetDetails/getCatalog']);
  const getDistributions = computed(() => store.getters['datasetDetails/getDistributions']);
  const getPublisher = computed(() => store.getters['datasetDetails/getPublisher']);
  const getContactPoints = computed(() => store.getters['datasetDetails/getContactPoints']);

  const computedLocale = computed(() => {
    return route.query?.locale;
  });

  return computed(() => {
    // PAYLOAD
    const payload = {
      '@context': 'http://schema.org',
      '@type': 'Dataset',
      name: '', // https://schema.org/Dataset
      description: '', // https://schema.org/Dataset
      license: {}, // https://schema.org/Dataset
      spatialCoverage: {}, // https://schema.org/Dataset
      keywords: [] as any[], // https://schema.org/Dataset
      catalog: {}, // https://schema.org/DataCatalog
      identifier: [] as any[],
      distribution: [] as any[], // https://schema.org/DataDownload
      creator: [] as any[], // https://schema.org/Organization
      contactPoint: [] as any[], // https://schema.org/ContactPoint
    };

    // https://schema.org/Dataset
    payload.name = getTranslationFor(getTitle.value, computedLocale.value, getLanguages.value);
    payload.name = payload.name ? payload.name.substring(0, 4999) : payload.name;
    payload.description = getTranslationFor(getDescription.value, computedLocale.value, getLanguages.value);
    payload.description = payload.description ? payload.description.substring(0, 4999) : payload.description;
    payload.license = getSchemaOfFirstAvailableLicense(store).value;
    payload.spatialCoverage = getSchemaOfSpatialCoverage(getSpatial.value);
    payload.identifier = getOtherIdentifiers.value;
    if (showObjectArray(getKeywords.value)) {
      getKeywords.value.forEach((keyword: any) => {
        if (showKeyword(keyword)) {
          payload.keywords.push(keyword.title);
        }
      });
    }

    // https://schema.org/DataCatalog
    payload.catalog = {
      '@type': 'DataCatalog',
      name: getTranslationFor(getCatalog.value.title, computedLocale.value, getLanguages)?.substring(0, 4999),
      description: getTranslationFor(getCatalog.value.description, computedLocale.value, getLanguages)?.substring(0, 4999),
      // publisher: getCatalog.value.publisher,
      url: getCatalog.value.homepage,
      // inLanguage: isArray(getCatalog.value.language) ? getCatalog.value.language[0] : getCatalog.value.language,
      license: getSchemaOfLicense(getCatalog.value.license),
      dateModified: getCatalog.value.modificationDate,
      spatialCoverage: getSchemaOfSpatialCoverage(getCatalog.value.getSpatial),
    };

    // https://schema.org/DataDownload
    getDistributions.value.forEach((distro: any) => {
      const distroResult = {
        '@type': 'DataDownload',
        name: getDistributionTitle(distro, computedLocale.value, getLanguages.value),
        encodingFormat: getDistributionFormat(distro),
        license: getSchemaOfLicense(distro.licence),
        contentSize: distro.byteSize,
        datePublished: distro.releaseDate,
        dateModified: distro.modificationDate,
        contentUrl: undefined,
      };
      if (showAccessUrls(distro)) {
        distroResult.contentUrl = distro.accessUrl[0];
      }
      payload.distribution.push(distroResult);
    });

    // https://schema.org/Organization
    const publisher = getPublisher.value;
    if (publisher.name && !isNil(publisher.name)) {
      payload.creator.push({
        '@type': 'Organization',
        name: publisher.name,
      });
    }

    // https://schema.org/ContactPoint
    getContactPoints.value.forEach((contactPoint: any) => {
      const hasName = has(contactPoint, 'name') && !isNil(contactPoint.name);
      const hasEmail = has(contactPoint, 'email') && !isNil(contactPoint.email);
      const hasAddress = has(contactPoint, 'address') && !isNil(contactPoint.address);
      const hasTelephone = has(contactPoint, 'telephone') && !isNil(contactPoint.telephone);
      if ((hasName || hasEmail || hasAddress || hasTelephone)) {
        const c = {
          '@type': 'ContactPoint',
          name: undefined,
          email: undefined,
          address: undefined,
          telephone: undefined,
        };

        if (hasName) c.name = contactPoint!.name;
        if (hasEmail) c.email = contactPoint.email;
        if (hasAddress) c.address = contactPoint.address;
        if (hasTelephone) c.telephone = contactPoint.telephone;

        payload.contactPoint.push(c);
      }
    });
    return payload;
  });
}

export function useDatasetDetailsDatasetHead() {
  const store = useStore();
  const route = useRoute();

  const datasetSchema = computed(() => {
    return getSchemaOrg(store, route).value;
  })

 const schemaOrg = computed(() => [{
    type: 'application/ld+json',
    textContent: JSON.stringify({ ...datasetSchema.value }, null, 2),
  }])

  const head = useHead({
    meta: [
      {
        name: 'description',
        vmid: 'description',
        content: () => {
          const getDescription: ComputedRef<string> = computed(() => store.getters['datasetDetails/getDescription'] as string || '');
          const getTitle: ComputedRef<string> = computed(() => store.getters['datasetDetails/getTitle'] as string || '');
          const getLanguages = computed(() => store.getters['datasetDetails/getLanguages']);
          const computedLocale = computed(() => {
            return route.query?.locale;
          });
          return getTranslationFor(getDescription.value, computedLocale.value, getLanguages.value) || getTranslationFor(getTitle.value, computedLocale.value, getLanguages.value);
        },
      },
      {
        name: 'keywords',
        vmid: 'keywords',
        content: () => {
          const getKeywords = computed(() => store.getters['datasetDetails/getKeywords']);
          return getKeywords.value.map((keyword: any) => keyword.title).join(' ');
        },
      },
      {
        name: 'subject',
        vmid: 'subject',
      },
      {
        name: 'robots',
        content: 'index',
      },
    ],
    script: schemaOrg,
    link: [
      { rel: 'canonical', href: window.location.href },
    ],
  })
  
  return {
    head,
    schemaOrg,
  }
}