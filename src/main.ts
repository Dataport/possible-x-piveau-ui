// Import IE Promise polyfill
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import '@babel/polyfill';
import 'es6-promise/auto';
// Import jQuery
import $ from 'jquery';
// Import vuex-router-sync
import { sync } from 'vuex-router-sync';
// Import vue-progressbar
import VueProgressBar from 'vue-progressbar';
// Import vue-i18n
import VueI18n from 'vue-i18n';
import VueFormulate from '@braid/vue-formulate';
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
// Import vue-meta
import Meta from 'vue-meta';
// Import vue-inject
import injector from 'vue-inject';
// Import vee-validate
import VeeValidate from 'vee-validate';
import DeuHeaderFooter from '@deu/deu-header-footer';
import UniversalPiwik from '@piveau/piveau-universal-piwik';
// import AppToast from '@/components/AppToast';
// Import v-select
// Import i18n validation messages for vueformulate
// import {
// ca, cs, da, nl, de, en, fr, hu, it, lt, nb, pl, pt, ru, sr, sk, es, tr, sv,
// } from '@braid/vue-formulate-i18n';

// Import Font Awesome Icons Library for vue
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
import VuePositionSticky from 'vue-position-sticky';
import VueKeycloak from './plugins/vue-keycloak-js';
// Import main user configurations (glueConfig) and i18n configurations
import { glueConfig as GLUE_CONFIG, i18n as I18N_CONFIG } from '../config/user-config';
// Import vue-router
import router from './router';
// Import vuex store
import store from './store/index';
// Import the APP component
import App from './App';
// Import dateFilters
import { dateFilters, AppSnackbar, AppConfirmationDialog } from '@piveau/piveau-hub-ui-modules';
// Import runtimeconfig
import RuntimeConfiguration from './runtimeconfig';
// Import services
import services from './services/services';
// Import corsproxy service
import CorsproxyService from './plugins/corsproxy-service';
// Import bulkdownload hot fix service
import BulkDownloadAxiosInstance from './plugins/bulk-download-corsproxy-service';
// import additional custom vueformulate components
import InfoSlot from './components/data-provider-interface/components/InfoSlot';
import ConditionalInput from './components/data-provider-interface/components/ConditionalInput';
import AutocompleteInput from './components/data-provider-interface/components/AutocompleteInput';
import UniqueIdentifierInput from './components/data-provider-interface/components/UniqueIdentifierInput';
import FileUpload from './components/data-provider-interface/components/FileUpload';

Vue.config.devtools = true;

Vue.component('InfoSlot', InfoSlot);
Vue.component('ConditionalInput', ConditionalInput);
Vue.component('AutocompleteInput', AutocompleteInput);
Vue.component('UniqueIdentifierInput', UniqueIdentifierInput);
Vue.component('FileUpload', FileUpload);

// Vue.component('AppToast', AppToast);
Vue.component('AppSnackbar', AppSnackbar);
Vue.component('AppConfirmationDialog', AppConfirmationDialog);

// eslint-disable-next-line @typescript-eslint/no-var-requires
const VueCookie = require('vue-cookie');

Vue.use(VueCookie);

Vue.use(VueFormulate, {
  // plugins: [ca, cs, da, nl, de, en, fr, hu, it, lt, nb, pl, pt, ru, sr, sk, es, tr, sv],
  validationNameStrategy: vm => vm.context.label,
  // Define our custom slot component(s)
  slotComponents: {
    label: 'InfoSlot',
  },
  // Define any props we want to pass to our slot component
  slotProps: {
    label: ['info'],
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
    'unique-identifier-input': {
      classification: 'text',
      component: 'UniqueIdentifierInput',
    },
  },
});

// Runtimeconfig setup
Vue.use(RuntimeConfiguration, { baseConfig: GLUE_CONFIG, debug: false });

// Corsproxy setup
Vue.use(CorsproxyService, Vue.prototype.$env.api.vueAppCorsproxyApiUrl);

// Bulk Download hotfix setup
Vue.use(BulkDownloadAxiosInstance, Vue.prototype.$env.api.vueAppCorsproxyApiUrl);

const { isPiwikPro, siteId, trackerUrl } = Vue.prototype.$env.tracker;
Vue.use(UniversalPiwik, {
  router,
  isPiwikPro,
  trackerUrl,
  siteId,
  debug: process.env.NODE_ENV === 'development',
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


// Configured language
const LOCALE = Vue.prototype.$env.languages.locale;
const FALLBACKLOCALE = Vue.prototype.$env.languages.fallbackLocale;

// Vue-i18n setup
Vue.use(VueI18n);
// eslint-disable-next-line
export const i18n = new VueI18n({
  locale: LOCALE,
  fallbackLocale: FALLBACKLOCALE,
  messages: I18N_CONFIG,
  silentTranslationWarn: true,
});

// Set locale for dateFilters
dateFilters.setLocale(LOCALE);

// Vue-meta setup
Vue.use(Meta, {
  refreshOnceOnNavigation: true,
  debounceWait: 100,
});

// Bootstrap requirements to use js-features of bs-components
require('popper.js');

require('bootstrap');

require('./styles/styles.scss');

$(() => {
  $('[data-toggle="popover"]').popover({ container: 'body' });
  $('[data-toggle="tooltip"]').tooltip({ container: 'body' });
});

require('@fortawesome/fontawesome-free/css/all.css');

require('@deu/deu-header-footer/dist/deu-header-footer.css');

// OpenStreetMaps popup styles
require('leaflet/dist/leaflet.css');

require('@piveau/dcatap-frontend/dist/dcatap-frontend.css');

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
Vue.use(VueProgressBar, progressBarOptions);

// Vee-validate (form validation) setup
Vue.use(VeeValidate, { errorBagName: 'vee_validator_errors' });

// Vue-inject setup
Vue.use(injector, { components: true });

Vue.use(DeuHeaderFooter);

Vue.use(VuePositionSticky);

// Services setup
services(Vue.prototype.$env);

// Sync store and router
sync(store, router);

// Add Font Awesome Icons
library.add(faGoogle, faGooglePlus, faGooglePlusG, faFacebook, faFacebookF, faInstagram, faTwitter, faLinkedinIn, faComment, faExternalLinkAlt, faPlus, faMinus, faArrowDown, faArrowUp, faInfoCircle, faExclamationTriangle);
Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.config.productionTip = false;

// Creates the root Vue instance
const createVueApp = () => {
  const app = new Vue({
    router,
    store,
    i18n,
    render: h => h(App),
  });

  return app;
};

// Promise that timeouts after x seconds
const wait = ms => new Promise((resolve, reject) => setTimeout(() => {
  reject(new Error(`Keycloak failed to load after a timeout of ${ms} ms`));
}, ms));

const useVueWithKeycloakPromise = new Promise((resolve, reject) => {
  Vue.use(VueKeycloak, {
    config: {
      rtp: Vue.prototype.$env.rtp,
      ...Vue.prototype.$env.keycloak,
    },
    init: {
      ...window.Cypress && { checkLoginIframe: !window.Cypress },
      onLoad: 'check-sso',
      silentCheckSsoRedirectUri: `${window.location.origin}${process.env.buildconf.BASE_PATH}static/silent-check-sso.html`,
    },
    onReady: resolve,
    onInitError: reject,
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
  if (!Vue.prototype.$env.useAuthService) {
    createVueApp().$mount('#app');
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
    createVueApp().$mount('#app');
  }

  return {};
})();
