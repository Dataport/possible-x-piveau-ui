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
          <ul class="navbar-nav ml-2 mt-2">
            <li
              v-for="(navItem, i) in filteredNavigationItems"
              :key="`navItem@${i}`"
              class="nav-item"
            >
              <slot name="nav-item" v-bind:nav-item="navItem">
                <router-link
                  v-if="navItem.to"
                  :to="navItem.to"
                  class="nav-link"
                  active-class="router-link-active"
                >
                  {{ navItem.title }}
                </router-link>
                <a
                  v-else
                  :href="navItem.href"
                  class="nav-link"
                >
                  {{ navItem.title }}
                </a>
              </slot>
            </li>
          </ul>
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
            </slot>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
import { useResourcesStore } from '@piveau/piveau-hub-ui-modules';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import Logo from './Logo.vue';
import LanguageSelector from './LanguageSelector.vue';

export default {
  name: 'Piveau-Header',
  data() {
    return {};
  },
  components: {
    Logo,
    LanguageSelector,
    FontAwesomeIcon,
  },
  props: {
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
  computed: {
    getAvailableResources() {
      let availableResources = this.resourcesStore.getters.getAvailableResources;

      // TODO: Replace this hacky solution if datasets and catalogues exist in available resources
      // availableResources.push('datasets');
      // availableResources.push('catalogues');

      return availableResources;
    },
    defaultNavigationItems() {
      let defaultNavigationItems = this.$env.routing.navigation.defaultNavigationItems;
      
      return defaultNavigationItems.map(item => {

        let navItem = {
          id: item.id,
          title: this.$t(`message.header.navigation.data.${item.id}`),
          to: { 
            name: item.name, 
            query: { locale: this.$route.query.locale } 
          },
        };

        if (item.name === 'ResourceSearchPage') navItem.to.params = { resource_type: this.getRawResourceType(item.id) };
          
        return navItem;
      });
    },
    filteredNavigationItems() {
      return this.defaultNavigationItems.filter(item => this.getAvailableResources.includes(item.id));
    },

  },
  created() {},
  methods: {
    getRawResourceType(type) {
      return Object.keys(this.$env.content.resources.resourceMapping)[Object.values(this.$env.content.resources.resourceMapping).indexOf(type)];
    },
  },
  setup() {
    const resourcesStore = useResourcesStore();

    resourcesStore.actions.loadAvailableResources();

    return { resourcesStore };
  },
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
