<template>
  <div>
    <resource-access-popup ref="externalResourceModal" />
    <span property="dc:issued" :content="getReleaseDate"></span>
    <span property="dc:modified" :content="getModificationDate"></span>
    <div v-if="loadingDatasetDetails">
      <dataset-details-skeleton type="DatasetDetails"></dataset-details-skeleton>
    </div>
    <div v-if="!loadingDatasetDetails" class="dsd-dataset">
      <dataset-details-description 
        v-if="showDatasetDescription"
        :dateIncorrect="dateIncorrect"
        :machineTranslated="machineTranslated"
        :translationNotAvailable="translationNotAvailable"
      />
      <distributions
        :openModal="openModal"
        :getDistributions="getDistributions"
        :expandedDistributions="expandedDistributions"
        :expandedDistributionDescriptions="expandedDistributionDescriptions"
        :displayedDistributions="displayedDistributions"
        :isDistributionsAllDisplayed="isDistributionsAllDisplayed"
        :distributions="distributions"
        :setDistributionsDisplayCount="setDistributionsDisplayCount"
        :pages="pages"
        :showDownloadUrls="showDownloadUrls"
        :isOnlyOneUrl="isOnlyOneUrl"
        :getDistributionFormat="getDistributionFormat"
        :distributionFormatTruncated="distributionFormatTruncated"
        :getDistributionTitle="getDistributionTitle"
        :distributionVisibleContent="distributionVisibleContent"
        :distributionExpandedContent="distributionExpandedContent"
        :distributionDescriptionIsExpanded="distributionDescriptionIsExpanded"
        :distributionDescriptionIsExpandable="distributionDescriptionIsExpandable"
        :distributionIsExpanded="distributionIsExpanded"
        :showNumber="showNumber"
        :showObject="showObject"
        :showDownloadDropdown="showDownloadDropdown"
        :showLicence="showLicence"
        :showLicensingAssistant="showLicensingAssistant"
        :filterDateFormatEU="filterDateFormatEU"
        :showArray="showArray"
        :showObjectArray="showObjectArray"
        :getVisualisationLink="getVisualisationLink"
        :getDownloadUrl="getDownloadUrl"
        :trackGoto="trackGoto"
        :showAccessUrls="showAccessUrls"
        :replaceHttp="replaceHttp"
        :previewLinkCallback="previewLinkCallback"
        :toggleDistribution="toggleDistribution"
        :toggleDistributionDescription="toggleDistributionDescription"
        :increaseNumDisplayedDistributions="increaseNumDisplayedDistributions"
        :nonOverflowingIncrementsForDistributions="nonOverflowingIncrementsForDistributions"
        :appendCurrentLocaleToURL="appendCurrentLocaleToURL"
        :isUrlInvalid="isUrlInvalid"
        :openIfValidUrl="openIfValidUrl"
        :showTooltipVisualiseButton="showTooltipVisualiseButton"
        :showPublisher="showPublisher"
        :embed="embed"
      />

      <dataset-details-features
        :getKeywords="getKeywords"
        :pages="pages"
        :increaseNumDisplayedPages="increaseNumDisplayedPages"
        :nonOverflowingIncrementsForPages="nonOverflowingIncrementsForPages"
        :showKeyword="showKeyword"
        :trackGoto="trackGoto"
        :showObjectArray="showObjectArray"
        :showArray="showArray"
        :showObject="showObject"
      />

      <dataset-details-properties 
        v-if="showDatasetProperties"
        :filterDateFormatEU="filterDateFormatEU"
        :showObjectArray="showObjectArray"
        :showArray="showArray"
        :showString="showString"
        :showObject="showObject"
        :showNumber="showNumber"
      />
    </div>
  </div>
</template>

<script lang="ts">
  // @ts-nocheck
  /* eslint-disable no-confusing-arrow, no-nested-ternary, no-return-assign, no-confusing-arrow */
  import $ from 'jquery';
  import { mapActions, mapGetters } from 'vuex';
  import {
    has,
    isNil,
    isArray,
    isObject,
    isString,
    isNumber,
    isEmpty,
  } from 'lodash';
  import AppLink from '../widgets/AppLink.vue';
  import Tooltip from '../widgets/Tooltip.vue';
  import Distributions from './distributions/Distributions.vue';
  import dateFilters from '../filters/dateFilters';
  import {
    getTranslationFor, getCountryFlagImg, truncate, replaceHttp, appendCurrentLocaleToURL
  } from '../utils/helpers';
  import ResourceAccessPopup from '../widgets/ResourceAccessPopup.vue';
  import DatasetDetailsExtendedMetaData
    from "../datasetDetails/features/DatasetDetailsIsUsedBy.vue";
  import DatasetDetailsSkeleton from "../datasetDetails/DatasetDetailsSkeleton.vue";

  export default {
    name: 'datasetDetailsDataset',
    components: {
      DatasetDetailsSkeleton,
      DatasetDetailsExtendedMetaData,
      AppLink,
      Tooltip,
      Distributions,
      ResourceAccessPopup
    },
    metaInfo() {
      return {
        meta: [
          {
            name: 'description',
            vmid: 'description',
            content: (this.getDescription
              ? `${this.getTranslationFor(this.getDescription, this.$route.query.locale, this.getLanguages.map(lang => lang.id))}`
              : `${this.getTranslationFor(this.getTitle, this.$route.query.locale, this.getLanguages.map(lang => lang.id))}`).substring(0, 4999),
          },
          {
            name: 'keywords',
            vmid: 'keywords',
            content: isNil(this.getKeywords) || this.getKeywords === 0
              ? ''
              : this.getKeywords.map(k => k.title).join(' ').substring(0, 4999),
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
        script: this.validateDataset(),
        link: [
          { rel: 'canonical', href: window.location.href },
        ],
      };
    },
    props: {
      distributionVisibleContent: {
        type: Array,
        default: () => ['license', 'licenseAttributionByText', 'modificationDate'],
      },
      distributionExpandedContent: {
        type: Array,
        default: () => [
            'releaseDate',
            'language',
            'availability',
            'status',
            'rights',
            'mediaType',
            'byteSize',
            'checksum',
            'pages',
            'type',
            'compressFormat',
            'packageFormat',
            'hasPolicy',
            'conformsTo',
            'spatialResolutionInMeters',
            'temporalResolution',
        ],
      },
      showDatasetDescription: {
        type: Boolean,
        default: () => true,
      },
      showDatasetProperties: {
        type: Boolean,
        default: () => true,
      },
      showPublisher: {
        type: Boolean,
        default: () => false,
      },
      embed: {
        type: Boolean,
        default: () => false,
      },
    },
    data() {
      return {
        defaultLocale: this.$env.languages.locale,
        // has to be INITIAL_DATASET_DESCRIPTION_LENGTH
        isDatasetDescriptionExpanded: false,
        loadingDatasetDetails: false,
        dateIncorrect: false,
        machineTranslated: false,
        translationNotAvailable: false,
        expandedDistributions: [],
        expandedDistributionDescriptions: [],
        datasetSchema: {},
        distributions: {
          displayAll: this.$env.content.datasetDetails.distributions.displayAll,
          displayCount: this.$env.content.datasetDetails.distributions.displayCount,
          incrementSteps: this.$env.content.datasetDetails.distributions.incrementSteps,
          descriptionMaxLines: this.$env.content.datasetDetails.distributions.descriptionMaxLines,
          descriptionMaxChars: this.$env.content.datasetDetails.distributions.descriptionMaxChars,
        },
        pages: {
          isVisible: this.$env.content.datasetDetails.pages.isVisible,
          displayAll: this.$env.content.datasetDetails.pages.displayAll,
          displayCount: this.$env.content.datasetDetails.pages.displayCount,
          incrementSteps: this.$env.content.datasetDetails.pages.incrementSteps,
          descriptionMaxLines: this.$env.content.datasetDetails.pages.descriptionMaxLines,
          descriptionMaxChars: this.$env.content.datasetDetails.pages.descriptionMaxChars,
        },
        showDescription: true,
      };
    },
    computed: {
      // import store-getters
      ...mapGetters('datasetDetails', [
      'getKeywords',
      'getAccessRights',
      'getAccrualPeriodicity',
      'getCatalog',
      'getContactPoints',
      'getDescription',
      'getDistributions',
      'getID',
      'getLanguages',
      'getLicences',
      'getModificationDate',
      'getOtherIdentifiers',
      'getPages',
      'getPublisher',
      'getReleaseDate',
      'getSpatial',
      'getTranslationMetaData',
      'getTitle',
      ]),
      displayedDistributions() {
        const sorted = [...this.getDistributions].sort((a, b) => {
          if (getTranslationFor(a.title, this.$route.query.locale, this.getLanguages) < getTranslationFor(b.title, this.$route.query.locale, this.getLanguages)) { return -1; }
          if (getTranslationFor(a.title, this.$route.query.locale, this.getLanguages) > getTranslationFor(b.title, this.$route.query.locale, this.getLanguages)) { return 1; }
          return 0;
        });
        return this.distributions.displayAll
          ? Object.freeze(sorted)
          : Object.freeze(sorted.slice(0, this.distributions.displayCount));
      },
      isDistributionsAllDisplayed() {
        return this.distributions.displayCount === this.getDistributions.length;
      },
      remainingDistributions() {
        return this.getDistributions.length - this.distributions.displayCount;
      }
    },
    methods: {
      ...mapActions('datasetDetails', [
        'loadDatasetDetails',
        'setLoading',
      ]),
      has,
      isNil,
      isArray,
      isObject,
      isString,
      isNumber,
      appendCurrentLocaleToURL,
      getTranslationFor,
      getCountryFlagImg,
      truncate,
      replaceHttp,
      initDatasetDetails() {
        this.datasetSchema = this.getSchemaOrg();
        this.piwikMetaPush();
        setTimeout(() => {
          if (typeof this.$piwik?.resume === "function") this.$piwik.resume();
        }, 500);
        this.$nextTick(() => {
        // Display/hide translation banners
          this.setTranslationBanners();
          $('[data-toggle="tooltip"]').tooltip({
            container: 'body',
          });
        });
      },
      setDistributionsDisplayCount(count: number) {
        this.distributions.displayCount = count;
      },
      openModal(callback, toggleDownloadPopup) {
        this.$refs.externalResourceModal.openModal(callback, toggleDownloadPopup)
      },
      previewLinkCallback(distribution) {
        return () => {
          this.$emit('track-link', this.getVisualisationLink(distribution), 'link');
          window.open(this.getVisualisationLink(distribution), '_blank');
        };
      },
      validateDataset() {
        const isConform = true;
        // const descriptionLength = (this.datasetSchema.description !== undefined) ? this.datasetSchema.description.length : 0;
        // const titleLength = (this.datasetSchema.name !== undefined) ? this.datasetSchema.name.length : 0;

        // if (descriptionLength === 0 || titleLength === 0) isConform = false;
        return (isConform) ? [{
          type: 'application/ld+json',
          json: this.datasetSchema,
        }] : [];
      },
      getSchemaOfSpatialCoverage(spatialObject) {
        let spatialCoverage = [];
        const spatial = spatialObject ? (spatialObject.length ? spatialObject[0] : spatialObject) : null;

        if (!spatial) return [];

        if (spatial.type === 'Polygon') {
          const places = [];
          const polygons = spatial.coordinates;
          polygons.forEach((polygon) => {
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
      },
      // Returns a schema.org license object by providing dcat-ap license
      // See https://schema.org/license
      // See https://confluencesrv.fokus.fraunhofer.de/pages/viewpage.action?spaceKey=PIV&title=DCAT-AP+Guide
      getSchemaOfLicense(license) {
        if (!isNil(license) && !isEmpty(license)) {
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

        return null;
      },
      // Returns a json-ld object of the license of the first distribution where a license exists in this dataset
      // or null, if first distribution or license does not exist
      getSchemaOfFirstAvailableLicense() {
        let license = null;
        const licenses = this.getLicences;

        if (licenses && licenses.length > 0) {
          const distributionLicense = licenses.find(l => l && (l.title || l.description || l.id || l.resource));

          if (distributionLicense) {
            license = this.getSchemaOfLicense(distributionLicense);
          }
        }
        return license;
      },
      getSchemaOrg() {
        // PAYLOAD
        const payload = {
          '@context': 'http://schema.org',
          '@type': 'Dataset',
          name: '', // https://schema.org/Dataset
          description: '', // https://schema.org/Dataset
          license: {}, // https://schema.org/Dataset
          spatialCoverage: {}, // https://schema.org/Dataset
          keywords: [], // https://schema.org/Dataset
          catalog: {}, // https://schema.org/DataCatalog
          distribution: [], // https://schema.org/DataDownload
          creator: [], // https://schema.org/Organization
          contactPoint: [], // https://schema.org/ContactPoint
        };

        // https://schema.org/Dataset
        payload.name = this.getTranslationFor(this.getTitle, this.$route.query.locale, this.getLanguages);
        payload.name = payload.name ? payload.name.substring(0, 4999) : payload.name;
        payload.description = this.getTranslationFor(this.getDescription, this.$route.query.locale, this.getLanguages);
        payload.description = payload.description ? payload.description.substring(0, 4999) : payload.description;
        payload.license = this.getSchemaOfFirstAvailableLicense();
        payload.spatialCoverage = this.getSchemaOfSpatialCoverage(this.getSpatial);
        payload.identifier = this.getOtherIdentifiers;
        if (this.showObjectArray(this.getKeywords)) {
          this.getKeywords.forEach((keyword) => {
            if (this.showKeyword(keyword)) {
              payload.keywords.push(keyword.title);
            }
          });
        }
        // https://schema.org/DataCatalog
        payload.catalog = {
          '@type': 'DataCatalog',
          name: this.getTranslationFor(this.getCatalog.title, this.$route.query.locale, this.getLanguages)?.substring(0, 4999),
          description: this.getTranslationFor(this.getCatalog.description, this.$route.query.locale, this.getLanguages)?.substring(0, 4999),
          publisher: this.getCatalog.publisher,
          url: this.getCatalog.homepage,
          inLanguage: isArray(this.getCatalog.language) ? this.getCatalog.language[0] : this.getCatalog.language,
          license: this.getSchemaOfLicense(this.getCatalog.license),
          dateModified: this.getCatalog.modificationDate,
          spatialCoverage: this.getSchemaOfSpatialCoverage(this.getCatalog.getSpatial),
        };

        // https://schema.org/DataDownload
        this.getDistributions.forEach((distro) => {
          const distroResult = {
            '@type': 'DataDownload',
            name: this.getDistributionTitle(distro),
            encodingFormat: this.getDistributionFormat(distro),
            license: this.getSchemaOfLicense(distro.licence),
            contentSize: distro.byteSize,
            datePublished: distro.releaseDate,
            dateModified: distro.modificationDate,
          };
          if (this.showAccessUrls(distro)) {
            distroResult.contentUrl = distro.accessUrl[0];
          }
          payload.distribution.push(distroResult);
        });

        // https://schema.org/Organization
        if (isObject(this.getPublisher) && has(this.getPublisher, 'name') && !isNil(this.getPublisher.name)) {
          payload.creator.push({
            '@type': 'Organization',
            name: this.getPublisher.name,
          });
        }

        // https://schema.org/ContactPoint
        this.getContactPoints.forEach((contactPoint) => {
          const hasName = has(contactPoint, 'name') && !isNil(contactPoint.name);
          const hasEmail = has(contactPoint, 'email') && !isNil(contactPoint.email);
          const hasAddress = has(contactPoint, 'address') && !isNil(contactPoint.address);
          const hasTelephone = has(contactPoint, 'telephone') && !isNil(contactPoint.telephone);
          if (isObject(contactPoint) && (hasName || hasEmail || hasAddress || hasTelephone)) {
            const c = { '@type': 'ContactPoint' };

            if (hasName) c.name = contactPoint.name;
            if (hasEmail) c.email = contactPoint.email;
            if (hasAddress) c.address = contactPoint.address;
            if (hasTelephone) c.telephone = contactPoint.telephone;

            payload.contactPoint.push(c);
          }
        });
        return payload;
      },
      filterDateFormatEU(date) {
        return dateFilters.formatEU(date);
      },
      /* ABSTRACT SHOW FUNCTIONS */
      showString(string) {
        return !isNil(string) && isString(string);
      },
      showNumber(number) {
        return !isNil(number) && isNumber(number);
      },
      showObject(object) {
        return !isNil(object) && isObject(object) && !Object.values(object).reduce((keyUndefined, currentValue) => keyUndefined && currentValue === undefined, true);
      },
      showArray(array) {
        return !isNil(array) && isArray(array) && array.length > 0;
      },
      showObjectArray(objectArray) {
        return this.showArray(objectArray) && !objectArray.reduce((objectUndefined, currentObject) => objectUndefined && Object.values(currentObject).reduce((keyUndefined, currentValue) => keyUndefined && currentValue === undefined, true), true);
      },
      /* SPECIFIC SHOW FUNCTIONS */
      /* for now show all licences */
      showLicence(licence) {
        // return (has(licence, 'id') && !isNil(licence.id))
        //   || (has(licence, 'label') && !isNil(licence.label))
        return true
      },
      showLicensingAssistant(distribution) {
        return has(distribution, 'licence.la_url') && this.showString(distribution.licence.la_url);
      },
      showDownloadDropdown(distribution) {
        return this.showAccessUrls(distribution) || this.showDownloadUrls(distribution);
      },
      isOnlyOneUrl(distribution) {
        return (this.showAccessUrls(distribution) && !this.showDownloadUrls(distribution))
      || (!this.showAccessUrls(distribution) && this.showDownloadUrls(distribution) && distribution.downloadUrls.length === 1);
      },
      getDownloadUrl(distribution) {
        let url;
        if (this.showAccessUrls(distribution) && !this.showDownloadUrls(distribution)) {
          url = distribution.accessUrl[0];
        }
        if (!this.showAccessUrls(distribution) && this.showDownloadUrls(distribution) && distribution.downloadUrls.length === 1) {
          url = distribution.downloadUrls[0];
        }
        return url;
      },
      showAccessUrls(distribution) {
        return has(distribution, 'accessUrl') && this.showArray(distribution.accessUrl);
      },
      showDownloadUrls(distribution) {
        return has(distribution, 'downloadUrls') && this.showArray(distribution.downloadUrls);
      },
      showKeyword(keyword) {
        return has(keyword, 'id')
          && has(keyword, 'title')
          && !isNil(keyword.id)
          && !isNil(keyword.title);
      },

      /* GETTER / SETTER FUNCTIONS */

      setDatasetOriginalLanguage(originalLanguage) {
        this.$i18n.locale = originalLanguage;
      },
      distributionIsExpanded(id) {
        setTimeout(() => {
          $('[data-toggle="tooltip"]').tooltip({
            container: 'body',
          });
        }, 500);
        return this.expandedDistributions.includes(id);
      },
      distributionDescriptionIsExpanded(id) {
        return this.expandedDistributionDescriptions.includes(id);
      },
      distributionDescriptionIsExpandable(description) {
        return isNil(description) ? false : description.length > this.distributions.descriptionMaxChars;
      },
      getDistributionFormat(distribution) {
        return has(distribution, 'format.label') && !isNil(distribution.format.label) ? distribution.format.label : '';
      },
      distributionFormatTruncated(distribution) {
        return this.getDistributionFormat(distribution).length > 4;
      },
      getDistributionTitle(distribution) {
        return distribution.title ? getTranslationFor(distribution.title, this.$route.query.locale, this.getLanguages) : '-';
      },
      getVisualisationLink(distribution) {
        // Return Visualisation Link
        const accessUrl = distribution.downloadUrls && distribution.downloadUrls.length ? distribution.downloadUrls[0] : distribution.accessUrl[0];
        return `/data/visualisation/?file=${encodeURIComponent(accessUrl)}`;
      },
      // getSubjectLink(subject) {
      //   return { path: `/datasets?subject=${subject.id}`, query: Object.assign({}, { locale: this.$route.query.locale }) };
      // },
      toggleDistribution(id) {
        const index = this.expandedDistributions.indexOf(id);
        if (index > -1) this.expandedDistributions.splice(index, 1);
        else this.expandedDistributions.push(id);
      },
      toggleDistributionDescription(id) {
        const index = this.expandedDistributionDescriptions.indexOf(id);
        if (index > -1) this.expandedDistributionDescriptions.splice(index, 1);
        else this.expandedDistributionDescriptions.push(id);
      },
      setTranslationBanners() {
        if (!this.$i18n) return;
        const translationMetaData = this.getTranslationMetaData;
        // Check if translation of dataset is available in selected language
        if (!isNil(translationMetaData.details) && has(translationMetaData.details, this.$route.query.locale)) {
          // Check if dataset if machine translated
          this.machineTranslated = translationMetaData.details[this.$route.query.locale].machine_translated;
        } else {
          // No translation of this dataset available for the selected language
          this.translationNotAvailable = true;
        }
      },
      // Emit a Matomo event when user clicks on 'go to resource' element
      trackGoto() {
        const paq = window._paq || []; // eslint-disable-line
        // paq.push(['trackEvent', 'GoToResource', 'Clicked']);
        this.$piwik.trackGotoResource();
      },
      clamp(n, min, max) {
        return Math.min(Math.max(n, min), max);
      },
      // Increases the current number of distributions displayed
      // and clamps the result so that it never exceeds the number of all distributions.
      increaseNumDisplayedDistributions(increment) {
        const clampedSum = this.clamp(this.distributions.displayCount + increment, 0, this.getDistributions.length);
        this.distributions.displayCount = clampedSum;
      },
      nonOverflowingIncrementsForDistributions(incrementStep) {
        return this.distributions.displayCount + incrementStep <= this.getDistributions.length;
      },
      // Increases the current number of distributions displayed
      // and clamps the result so that it never exceeds the number of all distributions.
      increaseNumDisplayedPages(increment) {
        const clampedSum = this.clamp(this.pages.displayCount + increment, 0, this.getPages.length);
        this.pages.displayCount = clampedSum;
      },
      nonOverflowingIncrementsForPages(incrementStep) {
        return this.pages.displayCount + incrementStep <= this.getPages.length;
      },
      piwikMetaPush() {
        this.$piwik.trackDatasetDetailsPageView(null, null, {
          dataset_AccessRights: this.getAccessRights,
          dataset_AccrualPeriodicity: this.getAccrualPeriodicity,
          dataset_Catalog: this.getCatalog,
          // dataset_Categories: this.getCategories,
          // dataset_ConformsTo: this.getConformsTo,
          // dataset_ContactPoints: this.getContactPoints,
          // dataset_Country: this.getCountry,
          // dataset_Creator: this.getCreator,
          // dataset_Description: this.getDescription,
          // dataset_Distributions: this.getDistributions,
          // dataset_DistributionFormats: this.getDistributionFormats,
          // dataset_Documentations: this.getDocumentations,
          // dataset_Frequency: this.getFrequency,
          // dataset_HasVersion: this.getHasVersion,
          dataset_ID: this.getID,
          // dataset_Identifiers: this.getIdentifiers,
          // dataset_IdName: this.getIdName,
          // dataset_IsVersionOf: this.getIsVersionOf,
          // datest_Keywords: this.getKeywords,
          // dataset_LandingPages: this.getLandingPagesResource,
          // dataset_Languages: this.getLanguages,
          // dataset_Licences: this.getLicences,
          // dataset_Loading: this.getLoading,
          // dataset_ModificationDate: this.getModificationDate,
          // dataset_OriginalLanguage: this.getOriginalLanguage,
          // dataset_OtherIdentifiers: this.getOtherIdentifiers,
          // dataset_Pages: this.getPages,
          // dataset_Provenances: this.getProvenances,
          dataset_Publisher: this.getPublisher,
          // dataset_RelatedResources: this.getRelatedResources,
          // dataset_ReleaseDate: this.getReleaseDate,
          // dataset_Sources: this.getSources,
          // dataset_Spatial: this.getSpatial,
          // dataset_SpatialResource: this.getSpatialResource,
          // dataset_Temporal: this.getTemporal,
          dataset_Title: this.getTitle,
          // dataset_TranslationMetaData: this.getTranslationMetaData,
          // dataset_VersionInfo: this.getVersionInfo,
          // dataset_VersionNotes: this.getVersionNotes,
        });
      },
      isUrlInvalid(url) {
        if (url) {
          try {
            /* eslint-disable no-useless-escape */
            return !(new RegExp("^((https?:\/\/(www\.)?)([-a-zA-Z0-9@:%._\+~#=]{1,256})([-a-zA-Z0-9()@:%_\+.~#?&//=]*))$", "i")).test(decodeURIComponent(url.split("=").pop()));
            /* eslint-enable no-useless-escape */
        } catch (e) {
            console.error(e);
          }
        }
      },
      openIfValidUrl(isValid, previewLinkCallback, distribution, event) {
        if (isValid) {
          // for (let key in this.$children) {
          //   if(this.$children[key].$refs["externalResourceModal"]) {
          //     this.$children[key].$refs["externalResourceModal"].openModal(previewLinkCallback(distribution), false);
          //   }
          // }
          this.openModal(previewLinkCallback(distribution), false);
        } else {
          event.preventDefault();
          event.stopPropagation();
        }
      },
      showTooltipVisualiseButton(invalidUrl) {
        if (invalidUrl) {
          return  this.$t('message.tooltip.invalidVisualise');
        }
        return ''
      },
    },
    mounted() {
      // Duplicated API call, execute only if data not already loaded
      if (this.$route.params.ds_id !== this.getID) {
        this.$Progress.start();
        this.loadingDatasetDetails = true;
        this.loadDatasetDetails(this.$route.params.ds_id)
          .then(() => {
            this.$Progress.finish();
            this.loadingDatasetDetails = false;
            this.initDatasetDetails();
          })
          .catch((err) => {
            console.warn(err); // eslint-disable-line
            this.$Progress.fail();
            if (typeof this.$piwik?.resume === "function") this.$piwik.resume();
            this.$router.replace({
              name: 'NotFound',
              query: { locale: this.$route.query.locale, dataset: this.$route.params.ds_id },
            });
          })
          .finally(() => this.$root.$emit('contentLoaded'));
      } else {
        this.initDatasetDetails();
        this.$root.$emit('contentLoaded')
      }

      this.$root.$on('date-incorrect', () => {
        this.dateIncorrect = true;
      });

      const distributionsConf = this.$env.content.datasetDetails && this.$env.content.datasetDetails.distributions;
      if (distributionsConf) {
        this.distributions.displayAll = distributionsConf.displayAll || this.distributions.displayAll;
        this.distributions.displayCount = parseInt(distributionsConf.displayCount, 10) || this.distributions.displayCount;

        if (typeof distributionsConf.incrementSteps === 'string') {
          // Need to parse as json array since env variables are string only
          distributionsConf.incrementSteps = JSON.parse(distributionsConf.incrementSteps);
        }
        this.distributions.incrementSteps = distributionsConf.incrementSteps || this.distributions.incrementSteps;
      }

      if (this.distributions.displayAll) this.distributions.displayCount = this.getDistributions.length;

      const pagesConf = this.$env.content.datasetDetails && this.$env.content.datasetDetails.pages;
      if (pagesConf) {
        this.pages.displayAll = pagesConf.displayAll || this.pages.displayAll;
        this.pages.displayCount = parseInt(pagesConf.displayCount, 10) || this.pages.displayCount;

        if (typeof pagesConf.incrementSteps === 'string') {
          // Need to parse as json array since env variables are string only
          pagesConf.incrementSteps = JSON.parse(pagesConf.incrementSteps);
        }
        this.pages.incrementSteps = pagesConf.incrementSteps || this.pages.incrementSteps;
      }

      if (this.pages.displayAll) this.pages.displayCount = this.getPages.length;
    },
    beforeUnmount() {
      $('.tooltip').remove();
    },
    destroyed() {
      this.$root.$off('date-incorrect');
    },
  };
</script>

<style lang="scss" scoped>

  .catalogue-label {
    white-space: pre-line;
  }

  .cursor-pointer {
    cursor: pointer;
  }

  .tag-color {
    background-color: var(--tag-color);
  }

  .btn-color {
     &:hover {
       background-color: #196fd2;
       border-color: #196fd2;
     }
  }

  .heading, .arrow, .copy-text {
    cursor: pointer;
  }

  .details-link {
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }

  .text-break {
    word-break: break-word;
  }

  td {
    padding-left: 0 !important;
    padding-top: 1% !important;
    padding-bottom: 1% !important;
  }

  .download-all-btn {
    min-width: 100px;
    height: 31px;
  }

  .d-inline-table {
    display: inline-table;
  }

  /*** BOOTSTRAP ***/
  button:focus {
    outline:0;
  }
  .options, .download {
    .dropdown-menu {
      .dropdown-item {
        &:hover {
          color: initial;
          background-color: initial;
        }
      }
    }
  }
.spinner-grow {
  width: 20px;
  height: 20px;
}

  /*** FONT AWESOME ICONS ***/
  .fa-check-square {
    color: #28a745;
    width: 16px;
    height: 16px;
  }

  /*** MATERIAL ICONS ***/
  %modal-icon {
    font-size: 18px;
    cursor: default;
  }

  .help-icon {
    @extend %modal-icon;
  }

  .check-icon {
    @extend %modal-icon;
    color: #28a745;
  }

  .material-icons.small-icon {
    font-size: 20px;
  }

  .distributions {

    &__item {
      position: relative;

      &--preview {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: linear-gradient(to bottom, rgba(0,0,0,0) 0%, white 55%);
        z-index: 10;
      }
    }

    &__actions {
      display: flex;
      justify-content: center;
      align-items: flex-end;
      height: 100%;
      z-index: 11;
    }
  }
  .mt-4 {
    margin-top: 1.5rem !important;
  }

  .keywords {

    &__item {
      position: relative;
    }

    &__actions {
      display: flex;
      justify-content: center;
      align-items: flex-end;
      height: 100%;
      z-index: 11;
    }
  }
  .sectionList {
    list-style-type: '→ ';
    margin-left:6.5%;
  }
  @media only screen and (max-width: 991px) {
  .sectionList {
    margin-left: 0;
  }
}
</style>
