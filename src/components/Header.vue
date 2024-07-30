<template>
  <div class="mb-5">
    <nav id="piveau-header" class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top px-5">
      <slot name="logo">
        <a class="navbar-brand" href="/">
          <Logo class="piveau-logo"></Logo>
        </a>
      </slot>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <div class="d-flex justify-content-between w-100">
          <div class="ml-5 flex-row ml-md-auto d-md-flex" role="navigation">
            <slot name="right">
              <ul v-if="enableAuthentication" class="navbar-nav">
                <li
                  class="nav-item"
                >
                  <button class="btn btn-link text-light" @click="$emit(authenticated ? 'logout' : 'login')">
                    <font-awesome-icon icon="user" /> {{ authenticated ? $t('message.header.subnav.logout') : $t('message.header.subnav.login') }}
                  </button>
                </li>
              </ul>
              <!-- Language box -->
              <div
                  v-if="useLanguageSelector"
              >
                <div class="input-group">
                  <language-selector :languageObject="languageObject" :override-locale="overrideLocale"></language-selector>
                </div>
              </div>
            </slot>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Logo from './Logo.vue';
import LanguageSelector from './LanguageSelector.vue';

export default {
  name: 'Piveau-Header',
  data() {
    return {
      isNuxt: false,
    };
  },
  components: {
    Logo,
    LanguageSelector,
    FontAwesomeIcon,
  },
  props: {
    project: {
      type: String,
      default: 'hub',
    },
    locale: {
      type: String,
      default: 'en',
    },
    useLanguageSelector: {
      type: Boolean,
      default: true,
    },
    languageObject: {
      type: Array,
      default() {
        return []
      }
    },
    headerBackground: {
      default: 'linear-gradient(0deg, rgba(0,154,165,1) 0%, rgba(26,52,113,1) 100%)',
    },
    overrideLocale: {
      type: String,
      default: '',
    },
    enableAuthentication: {
      type: Boolean,
      default: false,
    },
    authenticated: {
      type: Boolean,
      default: false,
    },
  },
  computed: {},
  created() {},
  methods: {},
};

</script>

<style lang="scss" scoped>
  // @import '../styles/_variables.scss';
  @import '../styles/custom_theme.scss';

  .navbar {
    background: $primary;
  }

  #piveau-header{
    position: relative;
  }

  .piveau-logo{
    max-height: 55px;
    width: auto;
    padding-top: 10px;
    padding-bottom: 10px;
  }

  .nav-link {
    color: rgba(250, 250, 250, 0.5) !important;

    &:hover {
      color: rgba(250, 250, 250, 0.75) !important;
    }
  }

  .router-link-active {
    color: rgba(250, 250, 250, 0.9) !important;
    font-size: 1rem;

    &:hover {
      color: rgba(250, 250, 250, 0.9) !important;
    }
  }
</style>
