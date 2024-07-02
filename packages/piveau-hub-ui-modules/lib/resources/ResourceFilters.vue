<template>
    <div class="filters-group ds">
      <slot name="search-bar" :query="query" :bind="{ value: query}" :on="{ input: setSearchQuery }" :search-fn="changeQuery">
        <div class="input-group">
          <input type="text" class="form-control rounded-lg ds-input"
                :aria-label="$t('message.datasets.searchBar.placeholder')"
                :placeholder="$t('message.datasets.searchBar.placeholder')"
                v-model="query"
                @keyup.enter="changeQuery(query)"
                @click="autocompleteData.show = autocompleteData.suggestions.length > 0 && query.length > 0 ? !autocompleteData.show : false">
          <slot name="update-filter" :query="query" :search-fn="changeQuery">
            <div class="input-group-append ml-2">
              <button class="btn btn-sm btn-primary d-flex align-items-center search-button ds-input" type="button" @click="changeQuery(query)">
                <i class="material-icons align-bottom">search</i>
              </button>
            </div>
          </slot>
          <div class="suggestion-list-group" v-if="autocompleteData.show">
            <ul class="list-group suggestion-list">
              <button class="list-group-item list-group-item-action"
                      v-for="suggestion in autocompleteData.suggestions"
                      :key="suggestion.id"
                      @click="handleSuggestionSelection(suggestion)">
                {{ getTranslationFor(suggestion.title, $route.query.locale, suggestion.languages) }}
              </button>
            </ul>
          </div>
        </div>
      </slot>
      <slot name="filters-tabs">
        <ResourceFiltersTabs :resource="resource" :use-sort="useSort" :use-catalogs="useCatalogs" :query="query" :sort-selected-label="sortSelectedLabel" :locale="$route.query.locale" />
      </slot>
    </div>
  </template>
  
  <script>
  import {mapActions} from "vuex";
  import { getTranslationFor } from "../utils/helpers";
  
  import ResourceFiltersTabs from "../resources/ResourceFiltersTabs";
  
  export default {
    name: "ResourceFilters",
    components: {
        ResourceFiltersTabs,
    },
    props: [
      "resource",
    ],
    data() {
      return {
        query: '',
        autocompleteData: {
          suggestions: {},
          show: true,
        },
        useCatalogs: this.$env.content.datasets.useCatalogs,
        useSort: this.$env.content.datasets.useSort,
        sortSelected: '',
        sortSelectedLabel: this.$t('message.sort.relevance')
      }
    },
    created() {
      this.query = this.$route.query.query || '';
    },
    methods: {
      getTranslationFor,
      ...mapActions('datasets', [
        'setQuery',
        'autocompleteQuery',
        'setSort'
      ]),
      changeQuery(query) {
        this.$router.replace(
          { query: Object.assign({}, this.$route.query, { query }, { page: 1 }) }
        ).catch(
          error => { console.error(error); }
        );
        this.setQuery(query);
      },
      handleSuggestionSelection(suggestion) {
        /* eslint-disable no-underscore-dangle */
        this.$router.push(
          { path: this.$route.path.slice(-1) === '/' ? `${this.$route.path}${suggestion.idName}` : `${this.$route.path}/${suggestion.idName}` }
        ).catch(
          error => { console.error(error); }
        );
      },
      setSearchQuery(query) {
        this.query = query;
      },
    },
  }
  </script>
  
  <style lang="scss" scoped>
  
  .suggestion-list-group {
    position: relative;
    width: 100%;
  }
  .suggestion-list {
    width: 100%;
    position: absolute;
    top: 0;
    z-index: 100;
  }
  
  .material-icons.small-icon {
    font-size: 20px;
  }
  .search-button {
    border-radius: 100% !important;
  
    &:hover {
      background-color: #196fd2;
      border-color: #196fd2
    }
  }
  
  </style>
  