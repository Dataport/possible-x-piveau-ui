<template>
  <div class="d-flex justify-content-between mt-3">
    <div class="btn-group">
      <span class="mr-2">Select Resource:</span>
      <button class="d-flex align-items-center custom-dropdown-button" id="resourceFiltersSelect" type="button" data-toggle="dropdown" aria-expanded="false">
        <div class="pl-2 h-100 d-flex align-items-center">
          {{ $t(`message.header.navigation.data.${resource}`) }}
        </div>
        <i class="pr-2 material-icons small-icon dropdown-icon">arrow_drop_down</i>
      </button>
      <ul class="dropdown-menu dropdown-menu-right" aria-labelledby="resourceFiltersSelect">
        <li 
          v-for="resourceID in availableResources" 
          class="dropdown-item mb-0" 
          :title="$t(`message.tooltip.${resourceID}`)"
          data-toggle="tooltip"
          data-placement="top">
          <router-link
            :to="{name: 'ResourceSearchPage', params: { resource_id: resourceID }, query: { locale: $route.query.locale }}"
            class="nav-link"
            :class="{ 'router-link-active': resourceID === resource, 'router-link-inactive': resourceID !== resource}"
            role="presentation">
                {{ $t(`message.header.navigation.data.${resourceID}`) }}
          </router-link>
        </li>
      </ul>
    </div>
    <div v-if="useSort" class="datasets-filters-filters btn-group border-1 mb-1">
      <span class="mr-2">Sort by:</span>
      <button class="d-flex align-items-center custom-dropdown-button" id="resourceFiltersSort" type="button" data-toggle="dropdown" aria-expanded="false">
        <div class="pl-2 h-100 d-flex align-items-center">
          {{ sortSelectedLabel }}
        </div>
        <i class="pr-2 material-icons small-icon dropdown-icon">arrow_drop_down</i>
      </button>
      <ul class="dropdown-menu dropdown-menu-right" aria-labelledby="resourceFiltersSort">
        <button
          class="dropdown-item"
          @click="setSortMethod('modified', 'desc', $t('message.sort.lastModified'))"
        >
          {{ $t('message.sort.lastUpdated') }}
        </button>
        <button
          class="dropdown-item"
          @click="setSortMethod('relevance', 'desc', $t('message.sort.relevance'))"
        >
          {{ $t('message.sort.relevance') }}
        </button>
        <button 
          class="dropdown-item" 
          @click="setSortMethod(`title.${$route.query.locale}`, 'asc', $t('message.sort.nameAZ'))">
          {{ $t('message.sort.nameAZ') }}
        </button>
        <button 
          class="dropdown-item" 
          @click="setSortMethod(`title.${$route.query.locale}`, 'desc', $t('message.sort.nameZA'))">
          {{ $t('message.sort.nameZA') }}
        </button>
        <button 
          class="dropdown-item" 
          @click="setSortMethod('issued', 'desc', $t('message.sort.lastCreated'))">
          {{ $t('message.sort.lastCreated') }}
        </button>
      </ul>
    </div>
  </div>
</template>
  
  <script>
  import { defineComponent } from 'vue'
  import { mapActions } from 'vuex';
  
  export default defineComponent({
    name: 'ResourceFiltersTabs',
    props: {
        resource: {
            type: String,
        },
        useSort: {
            type: Boolean,
            default: true
        },
        locale: {
            type: String,
            default: ''
        }
    },
    data() {
      return {
        sortSelected: '',
        sortSelectedLabel: this.$t('message.sort.relevance'),
      }
    },
    computed: {
        availableResources() {
            return ['datasets', 'catalogues', 'softwareOfferings'];
        },
    },
    watch: {
      sortSelected: {
        handler(sort) {
          this.$router.replace({ query: Object.assign({}, this.$route.query, { sort }) })
            .catch(error => { console.error(error); });
          this.setSort(sort);
        },
        deep: true,
      }
    },
    created() {
      this.initQuery();
      this.$nextTick(() => {
        this.initSort();
      });
    },
    methods: {
      ...mapActions('datasets', [
        'setQuery',
        'setSort'
      ]),
      /**
       * @description Initialize the query String by checking the route parameters
       */
      initQuery() {
        let query = this.$route.query.query;
        if (!query) {
          query = '';
          this.setQuery('');
        } else {
          this.query = query;
          this.setQuery(query);
        }
      },
      initSort() {
        let sort = this.$route.query.sort;
        if (sort) {
          sort = sort.split(',')[0].toLowerCase();
          if (sort.includes('title')) {
            if (sort.includes('desc')) {
              this.sortSelectedLabel = this.$t('message.sort.nameZA');
              this.setSortMethod(`title.${this.$route.query.locale}`, 'desc', this.$t('message.sort.nameZA'));
            } else {
              this.sortSelectedLabel = this.$t('message.sort.nameAZ');
              this.setSortMethod(`title.${this.$route.query.locale}`, 'asc', this.$t('message.sort.nameAZ'));
            }
          } else {
            if (sort === 'relevance+desc') {
              this.sortSelectedLabel = this.$t('message.sort.relevance');
              this.setSortMethod('relevance', 'desc', this.$t('message.sort.relevance'));
            }
            if (sort === 'modified+desc') {
              this.sortSelectedLabel = this.$t('message.sort.lastUpdated');
              this.setSortMethod('modified', 'desc', this.$t('message.sort.lastUpdated'));
            }
            if (sort === 'issued+desc') {
              this.sortSelectedLabel = this.$t('message.sort.lastCreated');
              this.setSortMethod('issued', 'desc', this.$t('message.sort.lastCreated'));
            }
          }
        } else this.setSort(`relevance+desc, modified+desc, title.${this.$route.query.locale}+asc`);
      },
      setSortMethod(method, order, label) {
        this.sortSelectedLabel = label;
        if (method === 'relevance') this.sortSelected = `${method}+${order}, modified+desc, title.${this.$route.query.locale}+asc`;
        if (method === 'modified') this.sortSelected = `${method}+${order}, relevance+desc, title.${this.$route.query.locale}+asc`;
        if (method === `title.${this.$route.query.locale}`) this.sortSelected = `${method}+${order}, relevance+desc, modified+desc`;
        if (method === 'issued') this.sortSelected = `${method}+${order}, relevance+desc, title.${this.$route.query.locale}+asc`;
        return this.sortSelected;
      },
    }
  });
  </script>
  
  <style scoped lang="scss">
  .custom-button {
    border: 1px solid black;
    background-color: white;
    outline: none;
  }
  .custom-middle-button {
    border: 1px solid black;
    border-left: none;
    background-color: white;
    outline: none;
  }
  
  .custom-dropdown-button {
    border: 1px solid black;
    padding: 0;
    background-color: white;
    outline: none;
  }
  
  .inactive-styles {
    color: rgba(0, 0, 0, 0.7);
  
    &:hover {
      background-color: rgb(247, 247, 247);
      color: black;
    }
    &:focus {
      background-color: rgb(247, 247, 247);
      color: black;
    }
  }
  
  .active-styles {
    background-color: rgba(0, 29, 133,0.1);
    color: black;
  }
  
  .border-radius-start {
    border-top-left-radius: 1.875rem;
    border-bottom-left-radius: 1.875rem;
  }
  .border-radius-end {
    border-top-right-radius: 1.875rem;
    border-bottom-right-radius: 1.875rem;
  }
  
  .router-link-active {
    color: #175baf !important;
    border: none !important;
    border-bottom: 2px solid #175baf !important;
  }
  .router-link-inactive {
    color: rgba(0, 0, 0, 0.7);
    border: none !important;
    &:hover {
      color: #175baf;
    }
  }
  
  .dropdown-item {
  &:active {
     background-color: var(--dropdown-item-active-bg);
   }
  }
  
  
  .cursor-pointer {
    cursor: pointer;
  }
  
  </style>