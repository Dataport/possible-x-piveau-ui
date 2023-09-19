// @ts-nocheck
import $ from 'jquery';
import { sync } from 'vuex-router-sync';

import { createMetaManager } from 'vue-meta'
import VueInject from 'vue-inject';
import * as VeeValidate from 'vee-validate';
import VueProgressBar from "@aacassandra/vue3-progressbar";
import VueCookies from 'vue3-cookies'
import VuePositionSticky from 'vue-position-sticky';
import VueClickAway from "vue3-click-away";
// import VueFormulate from '@braid/vue-formulate';
import { Skeletor } from 'vue-skeletor';
import 'vue-skeletor/dist/vue-skeletor.css';

import { createI18n } from 'vue-i18n'
import { createApp } from 'vue'

import router from './router';
import App from './App';

import Header from './components/Header.vue';
import Footer from './components/Footer.vue';
import UniversalPiwik from '@piveau/piveau-universal-piwik';

import { glueConfig as GLUE_CONFIG, i18n as I18N_CONFIG } from '../config/user-config';
import runtimeConfig from '../config/runtime-config';

import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faHome, faChevronDown, faBars, faTimes, faSearch, faExternalLinkAlt, faUser,
} from '@fortawesome/free-solid-svg-icons';
import {
  faComments,
} from '@fortawesome/free-regular-svg-icons';
import {
  faFacebook, faTwitter, faYoutube,
  faFacebookSquare, faTwitterSquare, faLinkedin, faYoutubeSquare,
} from '@fortawesome/free-brands-svg-icons';

library.add([
  faHome, faChevronDown, faBars, faTimes, faSearch, faExternalLinkAlt, faUser,
  faComments,
  faFacebook, faTwitter, faYoutube,
  faFacebookSquare, faTwitterSquare, faLinkedin, faYoutubeSquare,
]);
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import {
  dateFilters,
  AppSnackbar,
  AppConfirmationDialog,
  // vueKeycloak,
  bulkDownloadCorsProxyService ,
  corsProxyService,
  runtimeConfigurationService,
  store,
  InfoSlot,
  ConditionalInput,
  AutocompleteInput,
  CustomURL,
  CustomNumber,
  UniqueIdentifierInput,
  Groupedinput,
  FileUpload,
  DatePicker,
  DateTimePicker,
  configureModules,
} from '@piveau/piveau-hub-ui-modules';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

import { ecStyle } from '../config/user-config.js';

import vueKeycloak from "./services/keycloakService";

import ECSelectFacet from "./components/ECSelectFacet.vue";
import ECRadioFacet from "./components/ECRadioFacet.vue";
import ECMore from "./components/ECMore.vue";
import ECButton from "./components/ECButton.vue";
import ECInfo from "./components/ECInfo.vue";
import ECLinkButton from "./components/ECLinkButton.vue";
import ECDataInfoBox from "./components/ECDataInfoBox.vue";
import ECDatasets from "./components/ECDatasets.vue";
import ECDatasetsFilters from "./components/ECDatasetsFilters.vue";
import ECSubNavigation from "./components/ECSubNavigation.vue";
import ECDistributionsHeader from "./components/datasetDetails/ECDistributionsHeader.vue";
import ECDistributionDetails from "./components/datasetDetails/ECDistributionDetails.vue";

const app = createApp(App);

// Runtime Configuration Service
app.use(runtimeConfigurationService, runtimeConfig, { baseConfig: GLUE_CONFIG, debug: true });
const env = app.config.globalProperties.$env;

// Custom components
const components = ecStyle ? {
  SelectFacet: ECSelectFacet,
  RadioFacet: ECRadioFacet,
  PvShowMore: ECMore,
  PvButton: ECButton,
  PvBanner: ECInfo,
  PvDataInfoBox: ECDataInfoBox,
  DatasetDetailsNavigationPage: ECLinkButton,
  Datasets: ECDatasets,
  DatasetsFilters: ECDatasetsFilters,
  DistributionsHeader: ECDistributionsHeader,
  DistributionDetails: ECDistributionDetails,
  SubNavigation: ECSubNavigation
} : {};

configureModules(app, {
  components,
  services: GLUE_CONFIG.services,
  serviceParams: {
    baseUrl: env.api.baseUrl,
    qualityBaseUrl: env.api.qualityBaseUrl,
    similarityBaseUrl: env.api.similarityBaseUrl,
    gazetteerBaseUrl: env.api.gazetteerBaseUrl,
    hubUrl: env.api.hubUrl,
    keycloak: env.authentication.keycloak,
    rtp: env.authentication.rtp,
    useAuthService: env.authentication.useService,
    authToken: env.authentication.authToken,
    defaultScoringFacets: env.content.datasets.facets.scoringFacets.defaultScoringFacets,
  }
});

app.component('piveau-header', Header);
app.component('piveau-footer', Footer);
app.component('InfoSlot', InfoSlot);
app.component('ConditionalInput', ConditionalInput);
app.component('Groupedinput', Groupedinput);
app.component('AutocompleteInput', AutocompleteInput);
app.component('CustomURL', CustomURL);
app.component('CustomNumber', CustomNumber);
app.component('UniqueIdentifierInput', UniqueIdentifierInput);
app.component('FileUpload', FileUpload);
app.component('DatePicker', DatePicker);
app.component('DateTimePicker', DateTimePicker);
app.component('AppSnackbar', AppSnackbar);
app.component('AppConfirmationDialog', AppConfirmationDialog);

// Vue Router
app.use(router);

// Vuex Store
app.use(store);

// Sync store and router
sync(store, router);

// Vue i18n
const LOCALE = env.languages.locale;
const FALLBACKLOCALE = env.languages.fallbackLocale;

const i18n = createI18n({
  allowComposition: true,
  legacy: false,
  globalInjection: true,
  locale: LOCALE,
  fallbackLocale: FALLBACKLOCALE,
  messages: I18N_CONFIG,
  silentTranslationWarn: true,
  silentFallbackWarn: true,
  warnHtmlMessage: false,
});

app.config.globalProperties.i18n = i18n;
app.use(i18n);

// Skeleton Loader
app.component(Skeletor.name, Skeletor);

// Cookie Consent
app.use(VueCookies);

// Vue Clickaway
app.use(VueClickAway);

// Piwik
const { isPiwikPro, siteId, trackerUrl } = env.tracker;
app.use(UniversalPiwik, {
  router,
  isPiwikPro,
  trackerUrl,
  siteId,
  debug: process.env.NODE_ENV === 'development',
  useSuspendFeature: true,
  pageViewOptions: {
    // Set this to true as long as navigating to the /datasets/ route
    // adds a 'minScore' query to prevent duplicated tracking
    useDatasetsMinScoreFix: false,
    // Send empty dataset metadata for every page view
    // See https://gitlab.fokus.fraunhofer.de/piveau/organisation/piveau-scrum-board/-/issues/2098
    beforeTrackPageView: (to, from, tracker) => {
      if (to.name !== 'DatasetDetailsDataset') {
        tracker.trackDatasetDetailsPageView(null, null, {
          dataset_AccessRights: '',
          dataset_AccrualPeriodicity: '',
          dataset_Catalog: '',
          dataset_ID: '',
          dataset_Publisher: '',
          dataset_Title: '',
        });
      }
    },
  },
});

// Bulk Download
app.use(corsProxyService, env.api.vueAppCorsproxyApiUrl);

app.use(bulkDownloadCorsProxyService, GLUE_CONFIG, env.api.vueAppCorsproxyApiUrl);

// Vue Formulate
// app.use(VueFormulate, {
//   // plugins: [ca, cs, da, nl, de, en, fr, hu, it, lt, nb, pl, pt, ru, sr, sk, es, tr, sv],
//   validationNameStrategy: vm => vm.context.label,
//   // Define our custom slot component(s)
//   slotComponents: {
//     label: 'InfoSlot',
//   },
//   // Define any props we want to pass to our slot component
//   slotProps: {
//     label: ['info', 'collapsed'],
//   },
//   components: {
//     ConditionalInput,
//   },
//   library: {
//     fileupload: {
//       classification: 'text',
//       component: 'FileUpload',
//     },
//     'conditional-input': {
//       classification: 'text',
//       component: 'ConditionalInput',
//       slotProps: {
//         component: ['data'],
//       },
//     },
//     'grouped-input':{
//       classification: 'text',
//       component: 'Groupedinput',
//       slotProps: {
//         component: ['data'],
//       },
//     },
//     'custom-url':{
//       classification: 'text',
//       component: 'CustomURL',
//       slotProps: {
//         component: ['voc', 'multiple'],
//       },
//     },
//     'custom-number':{
//       classification: 'text',
//       component: 'CustomNumber',
//       slotProps: {
//         component: ['min', 'max'],
//       },
//     },
//     'autocomplete-input': {
//       classification: 'text',
//       component: 'AutocompleteInput',
//       slotProps: {
//         component: ['voc', 'multiple','annifTheme','dcatDE'],
//       },
//     },
//     'unique-identifier-input': {
//       classification: 'text',
//       component: 'UniqueIdentifierInput',
//     },
//     'date-picker': {
//       classification: 'date',
//       component: 'DatePicker',
//     },
//     'datetime-picker': {
//       classification: 'datetime-local',
//       component: 'DateTimePicker',
//     },
//   },
// });

// Set locale for dateFilters
dateFilters.setLocale(LOCALE);

// Vue-meta setup
const metaManager = createMetaManager();
app.use(metaManager);

import '@fortawesome/fontawesome-free/css/all.css';
import '@piveau/piveau-hub-ui-modules/styles';
import './styles/styles.scss';

import 'popper.js';
import 'bootstrap';
import 'leaflet/dist/leaflet.css';

$(() => {
  $('[data-toggle="popover"]').popover({ container: 'body' });
  $('[data-toggle="tooltip"]').tooltip({ container: 'body' });
});

// Vue-progressbar setup
const progressBarOptions = {
  thickness: '5px',
  autoRevert: false,
  transition: {
    speed: '1.0s',
    opacity: '0.5s',
    termination: 1000,
  },
};
app.use(VueProgressBar, progressBarOptions);

// Vee-validate (form validation) setup
app.use(VeeValidate, { errorBagName: 'vee_validator_errors' });

// Vue-inject setup
app.use(VueInject, { components: true });

app.use(VuePositionSticky);

// Add Font Awesome Icons
app.component('font-awesome-icon', FontAwesomeIcon);

app.config.productionTip = false;

// Promise that timeouts after x seconds
let waitTimeoutHandle;
const wait = ms => new Promise((resolve, reject) => waitTimeoutHandle = setTimeout(() => {
  reject(new Error(`Keycloak failed to load after a timeout of ${ms} ms`));
}, ms));

const useVueWithKeycloakPromise = new Promise((resolve, reject) => {
  app.use(vueKeycloak, {
    config: {
      rtp: env.authentication.rtp,
      ...env.authentication.keycloak,
    },
    init: {
      ...window.Cypress && { checkLoginIframe: !window.Cypress },
      onLoad: 'check-sso',
      silentCheckSsoRedirectUri: `${window.location.origin}${process.env.buildconf.BASE_PATH}static/silent-check-sso.html`,
      ...env.authentication.keycloakInit,
    },
    onReady: () => {
      resolve();
      if (waitTimeoutHandle) clearTimeout(waitTimeoutHandle);
    },
    onInitError: reject
  });
});

// Race promises
// Timeouts after ms seconds for error handling
// This is a workaround to keycloak-js adapter not passing exceptions properly in silent sso mode
// This issue is fixed via keycloak-js@15
// See https://github.com/keycloak/keycloak/pull/8161
// todo: refactor this when keycloak 15.x or higher backend is installed
const useVueWithKeycloakWithTimeout = ms => Promise.race([
  useVueWithKeycloakPromise,
  wait(ms),
]);

// Attempt to load Vue with Keycloak using recover mechanism
(async () => {

  if (ecStyle) {
    await import('./styles/ec-style.scss');
  }

  if (!env.authentication.useService) {
    app.mount('#app');
    return {};
  }

  try {
    // Load Keycloak
    await useVueWithKeycloakWithTimeout(window.Cypress ? 200 : 7000);
  } catch (ex) {
    // eslint-disable-next-line no-console
    console.error(ex);
  } finally {
    // Initialize Vue, even if Keycloak failed to load
    app.mount('#app');
  }

  return {};
})();
