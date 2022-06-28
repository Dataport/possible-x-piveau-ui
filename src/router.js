/* eslint-disable */
import Vue from 'vue';
import Router from 'vue-router';
import store from './store/index';
import { glueConfig as GLUE_CONFIG } from '../config/user-config';
import { decode } from './utils/jwt';
import {
    DatasetDetailsCategories,
    DatasetDetailsQuality,
    DatasetDetailsSimilarDatasets,
    DatasetDetailsDataset,
    DatasetDetails,
    MapBasic,
    MapBoundsReceiver,
    Datasets,
    Catalogues
} from "@piveau/piveau-hub-ui-modules";

// const Datasets = () => import(/* webpackChunkName: "Datasets" */ /* webpackPreload: true */'@/components/Datasets');
// const MapBoundsReceiver = () => import(/* webpackChunkName: "Datasets" */ /* webpackPreload: true */'@/components/MapBoundsReceiver');
// const DatasetDetails = () => import(/* webpackChunkName: "DatasetDetails" */ /* webpackPrefetch: true */'@/components/DEU-datasetDetails');
// const DatasetDetailsDataset = () => import(/* webpackChunkName: "DatasetDetails" */ /* webpackPrefetch: true */'@/components/DEU-datasetDetails-dataset');
// const DatasetDetailsCategories = () => import(/* webpackChunkName: "DatasetDetails" */ /* webpackPrefetch: true */'@/components/DEU-datasetDetails-categories');
// const DatasetDetailsSimilarDatasets = () => import(/* webpackChunkName: "DatasetDetails" */ /* webpackPrefetch: true */'@/components/DEU-datasetDetails-similarDatasets');
// const DatasetDetailsQuality = () => import(/* webpackChunkName: "DatasetDetails" */ /* webpackPrefetch: true */'@/components/DEU-datasetDetails-quality');
// const DatasetDetailsActivityStream = () => import(/* webpackChunkName: "DatasetDetails" */ /* webpackPrefetch: true */'@/components/DEU-datasetDetails-activityStream');
// const DistributionDetails = () => import(/* webpackChunkName: "DatasetDetails" */ /* webpackPrefetch: true */'@/components/DistributionDetails');
// const MapBasic = () => import(/* webpackChunkName: "DatasetDetails" */ /* webpackPrefetch: true */'@/components/MapBasic');
// const Catalogues = () => import(/* webpackChunkName: "Catalogues" */'@/components/Catalogues');
const Home = () => import(/* webpackChunkName: "Home" */'@/components/Home');
const Imprint = () => import(/* webpackChunkName: "Imprint" */'@/components/Imprint');
const PrivacyPolicy = () => import(/* webpackChunkName: "PrivacyPolicy" */'@/components/PrivacyPolicy');
const Auth = () => import(/* webpackChunkName: "Auth" */'@/components/Auth');
const NotFound = () => import(/* webpackChunkName: "NotFound" */'@/components/NotFoundDeu');
const SparqlSearch = () => import(/* webpackChunkName: "SparqlSearch" */'@/components/SparqlSearch');

const DataProviderInterface = () => import(/* webpackChunkName: "DataProviderInterface" */'@/components/data-provider-interface/DataProviderInterface');
const DataFetchingComponent = () => import(/* webpackChunkName: "DataProviderInterface" */'@/components/data-provider-interface/components/DataFetchingComponent');
const OverviewPage = () => import(/* webpackChunkName: "DataProviderInterface" */'@/components/data-provider-interface/views/OverviewPage');
const InputPage = () => import(/* webpackChunkName: "DataProviderInterface" */'@/components/data-provider-interface/views/InputPage');
const DraftsPage = () => import(/* webpackChunkName: "DataProviderInterface" */'@/components/data-provider-interface/views/DraftsPage');
const LinkedDataViewer = () => import(/* webpackChunkName: "DataProviderInterface" */'@/components/data-provider-interface/views/LinkedDataViewer');
const UserProfilePage = () => import(/* webpackChunkName: "DataProviderInterface" */'@/components/data-provider-interface/views/UserProfilePage');
const UserCataloguesPage = () => import(/* webpackChunkName: "DataProviderInterface" */'@/components/data-provider-interface/views/UserCataloguesPage');

Vue.use(Router);

const title = GLUE_CONFIG.title;

const router = new Router({
  base: GLUE_CONFIG.routerOptions.base,
  mode: GLUE_CONFIG.routerOptions.mode,
  linkActiveClass: 'active',
  scrollBehavior(to, from, savedPosition) {
    if (to.matched.some(route => route.meta.scrollTop)) return { x: 0, y: 0 };
    else if (savedPosition) return savedPosition;
    else return { x: 0, y: 0 };
  },
  routes: [
    {
      path: '/',
      redirect: { name: 'Datasets' },
      meta: {
        title,
      },
    },
    {
      path: '/datasets',
      name: 'Datasets',
      component: Datasets,
      meta: {
        title,
      },
    },
    {
      path: '/datasets/:ds_id',
      component: DatasetDetails,
      children: [
        {
          path: '',
          name: 'DatasetDetailsDataset',
          components: {
            datasetDetailsSubpages: DatasetDetailsDataset,
          },
          meta: {
            title,
          },
        },
        {
          path: 'categories',
          name: 'DatasetDetailsCategories',
          components: {
            datasetDetailsSubpages: DatasetDetailsCategories,
          },
          meta: {
            title,
          },
        },
        {
          path: 'similarDatasets',
          name: 'DatasetDetailsSimilarDatasets',
          components: {
            datasetDetailsSubpages: DatasetDetailsSimilarDatasets,
          },
          meta: {
            title,
          },
        },
        {
          path: 'quality',
          name: 'DatasetDetailsQuality',
          components: {
            datasetDetailsSubpages: DatasetDetailsQuality,
          },
          meta: {
            title,
          },
        },
        // {
        //   path: 'activityStream',
        //   name: 'DatasetDetailsActivityStream',
        //   component: {
        //     datasetDetailsSubpages: DatasetDetailsActivityStream,
        //   },
        //   meta: {
        //     title,
        //   },
        // },
        // {
        //   path: 'distributions/:dist_id',
        //   name: 'DistributionDetails',
        //   component: DistributionDetails,
        //   meta: {
        //     title,
        //   },
        // },
      ],
      meta: {
        title,
      },
    },
    {
      path: '/catalogues',
      name: 'Catalogues',
      component: Catalogues,
      meta: {
        title,
      },
    },
    {
      path: '/home',
      name: 'Home',
      component: Home,
      meta: {
        title,
      },
    },
    {
      path: '/imprint',
      name: 'Imprint',
      component: Imprint,
      title,
    },
    {
      path: '/privacypolicy',
      name: 'PrivacyPolicy',
      component: PrivacyPolicy,
      meta: {
        title,
      },
    },
    {
      path: '/maps',
      name: 'MapBasic',
      component: MapBasic,
      meta: {
        title,
      },
    },
    {
      path: '/mapsBoundsReceiver',
      name: 'MapBoundsReceiver',
      component: MapBoundsReceiver,
      meta: {
        title,
      },
    },
    {
      path: '/login',
      name: 'login',
      component: Auth,
      meta: {
        title,
        requiresAuth: true,
      },
    },
    {
      path: '/404',
      alias: '*',
      name: 'NotFound',
      component: NotFound,
      meta: {
        title,
      },
    },
    {
      path: '/sparql',
      name: 'SparqlSearch',
      component: SparqlSearch,
    },
  ]
});

if (GLUE_CONFIG.upload.useUpload) {
  router.addRoute({
    path: '/dpi/draft',
    name: 'DataProviderInterface-Draft',
    component: DraftsPage,
    meta: {
      requiresAuth: true,
    }
  }),
  router.addRoute({
    path: '/dpi/draft/:name.:format',
    name: 'DataProviderInterface-LinkedData',
    component: LinkedDataViewer,
    props: true,
    meta: {
      requiresAuth: true,
    }
  }),
  router.addRoute({
    path: '/dpi/user/',
    name: 'DataProviderInterface-UserProfile',
    component: UserProfilePage,
    meta: {
      requiresAuth: true,
    }
  }),
  router.addRoute({
    path: '/dpi/user-catalogues',
    name: 'DataProviderInterface-UserCatalogues',
    component: UserCataloguesPage,
    meta: {
      requiresAuth: true,
    }
  }),
  router.addRoute({
    path: '/dpi/edit/:catalog/:property/:id',
    name: "DataProviderInterface-Edit",
    component: DataFetchingComponent,
    props: true
  }),
  router.addRoute({
    path: "/dpi",
    name: "DataProviderInterface",
    component: DataProviderInterface,
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: ":property",
        name: "DataProviderInterface-Home",
        redirect: { path: ':property/step1' },
        props: true
      },
      {
        path: ":property/overview",
        name: "DataProviderInterface-Overview",
        component: OverviewPage,
        props: true
      },
      {
        path: ":property/:page",
        name: "DataProviderInterface-Input",
        component: InputPage,
        props: true,
        children: [
          {
            path: ":id",
            name: "DataProviderInterface-ID",
            component: InputPage,
            props: true,
          },
        ],
      },
    ]
  },
  );
}

router.beforeEach((to, from, next) => {
  // Hash mode backward-compatibility
  // Fixes https://gitlab.fokus.fraunhofer.de/viaduct/organisation/issues/432
  if (to.redirectedFrom && to.redirectedFrom.substr(0, 3) === '/#/') {
    let path = to.redirectedFrom.substr(2);
    const base = `${GLUE_CONFIG.routerOptions.base}/`;
    if (path.startsWith(base)) {
      // Restore standard Vue behavior when navigated to '/#/base'
      // so you are redirected to '/base' instead of '/base/base'
      path = '/';
    }
    next({ path, replace: true });
    return;
  }

  let isLinkedDataRequest = false;

  // RDF|N3|JSON-LD redirects
  if (/^\/(data\/)?datasets\/[a-z0-9-_]+(\.rdf|\.n3|\.jsonld|\.ttl|\.nt)/.test(to.path)) {
    isLinkedDataRequest = true;
    let locale = to.query.locale ? `&locale=${to.query.locale}` : '';
    window.location = `${router.app.$env.api.hubUrl}${to.path}?useNormalizedId=true${locale}`;
  }

  if (/^\/(data\/)?api\/datasets\/[a-z0-9-_]+(\.rdf|\.n3|\.jsonld|\.ttl|\.nt)/.test(to.path)) {
    isLinkedDataRequest = true;
    let locale = to.query.locale ? `?locale=${to.query.locale}` : '';
    let returnPath = to.path.replace('/api', '')
      .replace(/(\.rdf|\.n3|\.jsonld|\.ttl|\.nt)/, '')
      .replace('?useNormalizedId=true', '');
    window.location = `${window.location.protocol}//${window.location.host}${GLUE_CONFIG.routerOptions.base}${returnPath}${locale}`;
  }

  if (isLinkedDataRequest) {
    // Redirect to the same page but without linked data file ending suffix
    // to prevent the 404 redirection due to app trying to fetch the wrong dataset id
    const datasetIdWithoutSuffix = to.params?.ds_id.replace(/(\.rdf|\.n3|\.jsonld|\.ttl|\.nt)/, '');
    const newRoute = { ...to, params: { ...to.params, ds_id: datasetIdWithoutSuffix } };
    next(newRoute);
    return;
  }

  // Authentication
  if (to.matched.some(record => record.meta.requiresAuth)) {
    const auth = router.app.$env.useAuthService
      ? router.app.$keycloak.authenticated
      : null;
    if (!auth) {
      // TODO: Show unauthorized page here
    } else {
      router.app.$keycloak.getRtpToken().then((rtpToken) => {
        const decodedAccessToken = decode(rtpToken.data.access_token);
        let isAuthenticated = false;
        decodedAccessToken.authorization.permissions.forEach((permission) => {
          if (permission.scopes.find(scope => scope === 'dataset:create')) isAuthenticated = true;
        });
        isAuthenticated
          ? next()
          : next({ name: 'Datasets' });
      });
    }
  } else if (!to.query.locale && from.query.locale) {
    const pathWithCurrentLocale = `${to.path}?locale=${from.query.locale}`;
    next({ path: pathWithCurrentLocale });
  } else {
    document.title = to.meta.title;
    next();
  }
});

export default router;
