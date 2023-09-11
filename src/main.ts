// @ts-nocheck
import 'es6-promise/auto';
import $ from 'jquery';
import { sync } from 'vuex-router-sync';

import VueProgressBar from 'vue-progressbar';
import VueFormulate from '@braid/vue-formulate';
import Meta from 'vue-meta';
import injector from 'vue-inject';
import VeeValidate from 'vee-validate';
import VuePositionSticky from 'vue-position-sticky';
import VueCookie from 'vue-cookie';

import { createI18n } from 'vue-i18n'
import { createApp } from 'vue'

import router from './router';
import App from './App';
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';


import { glueConfig as GLUE_CONFIG, i18n as I18N_CONFIG } from '../config/user-config';
import runtimeConfig from '../config/runtime-config';

import UniversalPiwik from '@piveau/piveau-universal-piwik';

import vueKeyCloak from "./services/keycloakService"

import {
  dateFilters,
  AppSnackbar,
  AppConfirmationDialog,
  bulkDownloadCorsProxyService ,
  corsProxyService,
  runtimeConfigurationService,
  store,
  InfoSlot,
  ConditionalInput,
  AutocompleteInput,
  CustomNumber,
  CustomURL,
  UniqueIdentifierInput,
  FileUpload,
  DatePicker,
  DateTimePicker,
  configureModules,
  SelectedFacetsOverview
} from '@piveau/piveau-hub-ui-modules';
import '@piveau/piveau-hub-ui-modules/styles';

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
  faHome, faChevronDown, faBars, faTimes, faSearch, faExternalLinkAlt, faComments, faUser,
  faFacebook, faTwitter, faYoutube,
  faFacebookSquare, faTwitterSquare, faLinkedin, faYoutubeSquare,
]);

import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faGoogle,
  faGooglePlus,
  faGooglePlusG,
  faFacebook,
  faFacebookF,
  faInstagram,
  faTwitter,
  faLinkedinIn,
} from '@fortawesome/free-brands-svg-icons';
import {
  faComment,
  faExternalLinkAlt,
  faPlus,
  faMinus,
  faArrowDown,
  faArrowUp,
  faInfoCircle,
  faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const app = createApp(App);

app.config.devtools = true;

app.use(runtimeConfigurationService, runtimeConfig, { baseConfig: GLUE_CONFIG, debug: false });
const env = app.prototype.$env;

configureModules({
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
app.component('AutocompleteInput', AutocompleteInput);
app.component('UniqueIdentifierInput', UniqueIdentifierInput);
app.component('FileUpload', FileUpload);
app.component('DatePicker', DatePicker);
app.component('DateTimePicker', DateTimePicker);
app.component('CustomNumber', CustomNumber);
app.component('CustomURL', CustomURL)
app.component('AppSnackbar', AppSnackbar);
app.component('AppConfirmationDialog', AppConfirmationDialog);
app.component('SelectedFacetsOverview', SelectedFacetsOverview);

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
  locale: LOCALE,
  fallbackLocale: FALLBACKLOCALE,
  messages: I18N_CONFIG,
  silentTranslationWarn: true,
  silentFallbackWarn: true,
});

app.i18n = i18n;
app.use(i18n);

// Skeleton Loader
app.component(Skeletor.name, Skeletor);

app.use(VueCookie);

app.use(VueFormulate, {
  // plugins: [ca, cs, da, nl, de, en, fr, hu, it, lt, nb, pl, pt, ru, sr, sk, es, tr, sv],
  validationNameStrategy: vm => vm.context.label,
  // Define our custom slot component(s)
  slotComponents: {
    label: 'InfoSlot',
  },
  // Define any props we want to pass to our slot component
  slotProps: {
    label: ['info', 'collapsed'],
  },
  components: {
    ConditionalInput,
  },
  library: {
    fileupload: {
      classification: 'text',
      component: 'FileUpload',
    },
    'conditional-input': {
      classification: 'text',
      component: 'ConditionalInput',
      slotProps: {
        component: ['data'],
      },
    },
    'autocomplete-input': {
      classification: 'text',
      component: 'AutocompleteInput',
      slotProps: {
        component: ['voc', 'multiple'],
      },
    },
    'custom-url': {
      classification: 'text',
      component: 'CustomURL',
      slotProps: {
        component: ['context'],
      },
    },
    'custom-number': {
      classification: 'text',
      component: 'CustomNumber',
      slotProps: {
        component: ['context'],
      },
    },
    'unique-identifier-input': {
      classification: 'text',
      component: 'UniqueIdentifierInput',
    },
    'date-picker': {
      classification: 'date',
      component: 'DatePicker',
    },
    'datetime-picker': {
      classification: 'datetime-local',
      component: 'DateTimePicker',
    },
  },
});

app.use(corsProxyService, env.api.vueAppCorsproxyApiUrl);

app.use(bulkDownloadCorsProxyService, GLUE_CONFIG, env.api.vueAppCorsproxyApiUrl);

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

// Set locale for dateFilters
dateFilters.setLocale(LOCALE);

// Vue-meta setup
app.use(Meta, {
  refreshOnceOnNavigation: true,
  debounceWait: 100,
});

// Bootstrap requirements to use js-features of bs-components
import 'popper.js';

import 'bootstrap';

import './styles/styles.scss';


$(() => {
  $('[data-toggle="popover"]').popover({ container: 'body' });
  $('[data-toggle="tooltip"]').tooltip({ container: 'body' });
});

import '@fortawesome/fontawesome-free/css/all.css';

// OpenStreetMaps popup styles
import 'leaflet/dist/leaflet.css';

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
app.use(injector, { components: true });

app.use(VuePositionSticky);

// Sync store and router
sync(store, router);

// Add Font Awesome Icons
library.add(faGoogle, faGooglePlus, faGooglePlusG, faFacebook, faFacebookF, faInstagram, faTwitter, faLinkedinIn, faComment, faExternalLinkAlt, faPlus, faMinus, faArrowDown, faArrowUp, faInfoCircle, faExclamationTriangle);
app.component('font-awesome-icon', FontAwesomeIcon);

app.config.productionTip = false;

// Loads keycloak and if it fails it still loads the Vue app.
app.use(vueKeyCloak, {
  config: {
    rtp: env.authentication.rtp,
    ...env.authentication.keycloak,
  },
  init: {
    onLoad: 'check-sso',
    // silentCheckSsoRedirectUri: `${window.location.origin}/static/silent-check-sso.html`,
    ...env.authentication.keycloakInit,
  },
  onReady: () => {
    console.log("Keycloak loaded")
    app.mount('#app');
  },
  onInitError: () => {
    console.log("Error loading keycloak")
    app.mount('#app');
  }
});
