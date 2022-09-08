<template>
  <div class="app">
    <div class="app-snackbar position-fixed fixed-bottom m-3 m-md-5 py-5 d-flex justify-content-center w-100">
      <app-snackbar />
    </div>
    <cookie-consent :piwik-instance="$piwik" />
    <vue-progress-bar />
    <div class="site-wrapper">
      <deu-header
          project="hub"
          active-menu-item="data"
          :showSparql="showSparql"
      />
      <router-view
          class="content"
          :key="`${$route.fullPath}${minScoring}`"
      />

      <deu-footer
          :enable-authentication="$env.useAuthService"
          :authenticated="keycloak && keycloak.authenticated"
          @login="login"
          @logout="logout"
          @click-follow-link="handleFollowClick"/>
    </div>
    <dpi-menu v-if="keycloak && keycloak.authenticated"></dpi-menu>

  </div>

</template>

<script>
/* eslint-disable no-underscore-dangle */
import { mapGetters, mapActions } from 'vuex';
import { isNumber } from 'lodash';
import CookieConsent from '@deu/deu-cookie-consent';
import '@deu/deu-cookie-consent/dist/deu-cookie-consent.css';
import {
  DpiMenu,
  usePiwikSuspendFilter,
} from '@piveau/piveau-hub-ui-modules';

export default {
  name: 'app',
  components: {
    CookieConsent,
    DpiMenu,
  },
  mixins: [
    usePiwikSuspendFilter,
  ],
  metaInfo() {
    return {
      titleTemplate(chunk) {
        return chunk ? `${chunk} - data.europa.eu` : 'data.europa.eu';
      },
      meta: [
        { name: 'description', vmid: 'description', content: 'data.europa.eu' },
        { name: 'keywords', vmid: 'keywords', content: this.$env.keywords },
      ],
      htmlAttrs: {
        lang: this.$route.query.locale,
      },
    };
  },
  data() {
    return {
      tracker: null,
      matomoURL: this.$env.tracker.trackerUrl,
      piwikId: this.$env.tracker.siteId,
      lastRoute: null,
      keycloak: this.$keycloak,
      showSparql: this.$env.navigation.top.main.data.sparql.show,
    };
  },
  computed: {
    ...mapGetters('auth', [
      'securityAuth',
      'getRTPToken',
      'getKeycloak',
    ]),
    ...mapGetters('datasets', [
      'getMinScoring',
    ]),
    minScoring() {
      if (this.$env.datasets.facets.scoringFacets.useScoringFacets) {
        // Check local storage value
        let minScoring = localStorage.getItem('minScoring');
        if (minScoring && minScoring !== "undefined") {
          minScoring = parseInt(JSON.parse(minScoring), 10);
          if (isNumber(minScoring)) this.setMinScoring(minScoring);
        }
        // Check existing store value
        if (!isNumber(this.getMinScoring)) {
          minScoring = parseInt(this.$env.datasets.facets.scoringFacets.defaultMinScore, 10);
          this.setMinScoring(minScoring);
        }
        return `&minScoring=${minScoring}`;
      }
      return '';
    },
  },
  methods: {
    ...mapActions('auth', [
      'authLogin',
      'authLogout',
      'rtpToken',
      'setKeycloak',
    ]),
    ...mapActions('datasets', [
      'setMinScoring',
    ]),
    resume() {
      this.$piwik.resume();
    },
    isNumber,
    login() {
      this.$keycloak.loginFn();
    },
    logout() {
      this.$keycloak.logoutFn();
    },
    handleFollowClick(url) {
      this.$piwik.trackOutlink(url);
    },
  },
};
</script>

<style lang="scss">
// Normalizes default css rules. See: https://github.com/necolas/normalize.css
@import './styles/utils/normalize.css';

@font-face {
  font-family: "Ubuntu";
  src: local("Ubuntu"), url(../public/static/fonts/Ubuntu/Ubuntu-Regular.ttf) format("truetype");
}

* {
  box-sizing: border-box;
}

.site-wrapper header {
  display: initial;
}

.container-fluid {
  max-width: 1340px !important;
}
</style>

<style lang="scss" scoped>

.app {
  background-color: #fff;
}

.site-wrapper {
  border: 0;
  max-width: none;
  box-shadow: none;
  display: initial;

  .content {
    padding: 30px 30px 0 30px;
    margin-top: 15px;
    margin-bottom: 15px;
    background-color: white;
  }
}

.app-snackbar {
  z-index: 9999;
  pointer-events: none;
}
</style>
