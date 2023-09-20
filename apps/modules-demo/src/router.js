import * as Router from 'vue-router';
import { glueConfig as GLUE_CONFIG } from '../config/user-config';
import {
  Auth,
  DatasetDetailsCategories,
  DatasetDetailsQuality,
  DatasetDetailsSimilarDatasets,
  DatasetDetailsDataset,
  DatasetDetails,
  EmbedDataset,
  MapBasic,
  MapBoundsReceiver,
  Catalogues,
  NotFound,
  SparqlSearch,
  Imprint,
  PrivacyPolicy,
  DataProviderInterface,
  DataFetchingComponent,
  OverviewPage,
  InputPage,
  DraftsPage,
  LinkedDataViewer,
  UserProfilePage,
  UserCataloguesPage,
  decode,
  Datasets,
} from "@piveau/piveau-hub-ui-modules";
import ECDatasets from "../src/components/ECDatasets.vue"
import ECCatalogues from "../src/components/ECCatalogues.vue"
import ECDatasetDetailsQuality from "../src/components/datasetDetails/ECDatasetDetailsQuality.vue"

import { ecStyle } from '../config/user-config';

const title = GLUE_CONFIG.metadata.title;

const router = Router.createRouter({
  history: Router.createWebHistory(GLUE_CONFIG.routing.routerOptions.base),
  linkActiveClass: 'active',
  scrollBehavior(to, from, savedPosition) {
    if (to.matched.some(route => route.meta.scrollTop)) return { x: 0, y: 0 };
    else if (savedPosition) return savedPosition;
    else return { x: 0, y: 0 };
  },
  routes: [
    {
      path: '/',
      redirect: { name: 'Datasets'  },
    },
    {
      path: '/datasets',
      name: 'Datasets',
      component: ecStyle ? ECDatasets : Datasets,
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
        },
        {
          path: 'categories',
          name: 'DatasetDetailsCategories',
          components: {
            datasetDetailsSubpages: DatasetDetailsCategories,
          },
        },
        {
          path: 'similarDatasets',
          name: 'DatasetDetailsSimilarDatasets',
          components: {
            datasetDetailsSubpages: DatasetDetailsSimilarDatasets,
          },
        },
        {
          path: 'quality',
          name: 'DatasetDetailsQuality',
          components: {
            datasetDetailsSubpages: ecStyle ? ECDatasetDetailsQuality : DatasetDetailsQuality,
          },
        },
        {
          path: 'embed',
          name: 'EmbedDataset',
          components: {
            datasetDetailsSubpages: EmbedDataset,
          },
        },
      ],
    },
    {
      path: '/catalogues',
      name: 'Catalogues',
      component: ecStyle ? ECCatalogues : Catalogues,
    },
    {
      path: '/catalogues/:ctlg_id',
      name: 'CatalogueDetails',
      component: ecStyle ? ECDatasets : Datasets,
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
    },
    {
      path: '/maps',
      name: 'MapBasic',
      component: MapBasic,
    },
    {
      path: '/mapsBoundsReceiver',
      name: 'MapBoundsReceiver',
      component: MapBoundsReceiver,
    },
    {
      path: '/login',
      name: 'Login',
      component: Auth,
    },
    {
      path: '/logout',
      name: 'Logout',
      component: Auth,
    },
    {
      path: '/404',
      alias: '/(.)*',
      name: 'NotFound',
      component: NotFound,
    },
    {
      path: '/sparql',
      name: 'SparqlSearch',
      component: SparqlSearch,
    },
  ]
});

if (GLUE_CONFIG.content.dataProviderInterface.useService) {
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
  // Use a named group to match the file extension
  const fileExtension = `(?:${process.env.MODE === 'development' ? '--' : '\\.'}(rdf|n3|jsonld|ttl|nt))`;

  // Use a named group to match the dataset ID
  const datasetId = `([a-z0-9-_]+)`;

  // Use the named groups to form the regular expression
  const regexString = `^\\/datasets\\/${datasetId}${fileExtension}`;

  // Create the regular expression object
  const datasetIdRegex = new RegExp(regexString);

  // Check if the URL matches the regular expression
  const match = to.path.match(datasetIdRegex);
  // if the URL matches the regular expression then console.log the dataset ID
  if (match) {
    const datasetId = match[1];
    const format = match[2];
    // redirect to the dataset details page with query dl={format}
    next({ path: `/datasets/${datasetId}`, query: { dl: format } });
    return;
  }

  next();
})

router.beforeEach((to, from, next) => {
  // // Hash mode backward-compatibility
  // // Fixes https://gitlab.fokus.fraunhofer.de/viaduct/organisation/issues/432
  // if (to?.redirectedFrom?.substring(0, 3) === '/#/') {
  //   let path = to.redirectedFrom.substring(2);
  //   const base = `${GLUE_CONFIG.routing.routerOptions.base}/`;
  //   if (path.startsWith(base)) {
  //     // Restore standard Vue behavior when navigated to '/#/base'
  //     // so you are redirected to '/base' instead of '/base/base'
  //     path = '/';
  //   }
  //   next({ path, replace: true });
  //   return;
  // }

  // Authentication
  if (to.matched.some(record => record.meta.requiresAuth)) {
    const auth = router.app.$env.authentication.useService
      ? router.app.$keycloak.authenticated
      : null;
    if (!auth) {
      // TODO: Show unauthorized page here
    } else {
      router.app.$keycloak.getRtpToken().then((rtpToken) => {
        const decodedAccessToken = decode(rtpToken);
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
    const pathWithCurrentLocale = `${to.path}?locale=${from.query.locale}`; // TODO: Other queries may get lost here?
    next({ path: pathWithCurrentLocale });
  } else {
    document.title = to.meta.title;
    next();
  }
});

export default router;
