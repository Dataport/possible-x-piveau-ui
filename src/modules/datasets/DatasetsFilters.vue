<template>
  <div class="filters-group ds">
    <div class="row">
      <div class="col">
        <div class="input-group">
          <input type="text" class="form-control rounded-lg ds-input"
                :aria-label="$t('message.datasets.searchBar.placeholder')"
                :placeholder="$t('message.datasets.searchBar.placeholder')"
                v-model="query"
                @keyup.enter="changeQuery(query)"
                @click="autocompleteData.show = autocompleteData.suggestions.length > 0 && query.length > 0 ? !autocompleteData.show : false">
          <div class="input-group-append ml-2">
            <button class="btn btn-sm btn-primary d-flex align-items-center search-button ds-input" type="button" @click="changeQuery(query)">
              <i class="material-icons align-bottom">search</i>
            </button>
          </div>
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
      </div>
    </div>
    <div class="row mt-3">
      <div class="col">
        <ul class="d-flex justify-content-between flex-wrap-reverse nav nav-tabs" id="myTab" role="tablist">
          <div class="d-flex cursor-pointer">
            <li class="nav-item mb-0" role="tab"
                  :title="$t('message.tooltip.datasets')"
                  data-toggle="tooltip"
                  data-placement="top">
                <router-link
                  :to="{name: 'Datasets', query: { locale: $route.query.locale }}"
                  class="nav-link router-link-active"
                  role="presentation">
                     {{ $t('message.header.navigation.data.datasets') }}
                </router-link>

            </li>
            <li class="nav-item mb-0" role="tab"
                :title="$t('message.tooltip.catalogues')"
                data-toggle="tooltip"
                data-placement="top">
              <router-link
                :to="{name: 'Catalogues', query: { locale: $route.query.locale }}"
                v-if="useCatalogs"
                class="nav-link router-link-inactive"
                role="presentation">
                {{ $t('message.header.navigation.data.catalogs') }}
              </router-link>
            </li>
            <li class="nav-item mb-0" role="tab">
              <a
                :href="`/${this.$route.query.locale}/search?term=${query}&searchdomain=site`"
                class="nav-link router-link-inactive"
                role="presentation"
                :title="$t('message.tooltip.editorialContent')"
                data-toggle="tooltip"
                data-placement="top">
                {{ $t('message.searchTabs.editorialContent') }}
              </a>
            </li>
          </div>
          <div v-if="useSort" class="btn-group border-1 mb-1 double-button" role="group" aria-label="Button group with nested dropdown">
            <button
              type="button"
              class="custom-button pl-2 pr-2 border-radius-start d-flex align-items-center inactive-styles"
              :class="{'button-color-grey': isSortSelectedLabelActive($t('message.sort.lastUpdated'))}"
              :title="$t('message.tooltip.lastModified')"
              data-toggle="tooltip"
              data-placement="top"
              @click="setSortMethod('modified', 'desc', $t('message.sort.lastModified'))"
            >
              {{ $t('message.sort.lastUpdated') }}
            </button>
            <button
              type="button"
              class="custom-middle-button pl-2 pr-2 d-flex align-items-center inactive-styles"
              :class="{'button-color-grey': isSortSelectedLabelActive($t('message.sort.relevance'))}"
              :title="$t('message.tooltip.relevance')"
              data-toggle="tooltip"
              data-placement="top"
              @click="setSortMethod('relevance', 'desc', $t('message.sort.relevance'))"
            >
              {{ $t('message.sort.relevance') }}
            </button>
            <div class="btn-group" role="group">
              <button v-if="isSortSelectedLabelInDropdown()" class="button-color-grey d-flex align-items-center custom-dropdown-button border-radius-end" id="btnGroupDrop1" type="button" data-toggle="dropdown" aria-expanded="false">
                <div class="pl-2 h-100 d-flex align-items-center">
                  {{ sortSelectedLabel }}
                </div>
                <i class="pr-2 material-icons small-icon dropdown-icon">arrow_drop_down</i>
              </button>
              <button v-else class="d-flex align-items-center custom-dropdown-button border-radius-end inactive-styles" id="btnGroupDrop1" type="button" data-toggle="dropdown" aria-expanded="false">
                <div class="pl-2">
                  {{ $t('message.catalogsAndDatasets.more') }}
                </div>
                <i class="pr-2 material-icons small-icon dropdown-icon">arrow_drop_down</i>
              </button>
              <ul class="dropdown-menu dropdown-menu-right" aria-labelledby="btnGroupDrop1">
              <button class="dropdown-item" @click="setSortMethod(`title.${$route.query.locale}`, 'asc', $t('message.sort.nameAZ'))">
                {{ $t('message.sort.nameAZ') }}</button>
              <button class="dropdown-item" @click="setSortMethod(`title.${$route.query.locale}`, 'desc', $t('message.sort.nameZA'))">
                {{ $t('message.sort.nameZA') }}</button>
              <button class="dropdown-item" @click="setSortMethod('issued', 'desc', $t('message.sort.lastCreated'))">
                {{ $t('message.sort.lastCreated') }}</button>
              </ul>
            </div>
          </div>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import {mapActions} from "vuex";
import { getTranslationFor } from "@/modules/utils/helpers";

export default {
  name: "DatasetsFilters",
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
  methods: {
    getTranslationFor,
    ...mapActions('datasets', [
      'setQuery',
      'autocompleteQuery',
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
    changeQuery(query) {
      this.$router.replace(
        { query: Object.assign({}, this.$route.query, { query }, { page: 1 }) }
      ).catch(
        error => { console.log(error); }
      );
      this.setQuery(query);
    },
    handleSuggestionSelection(suggestion) {
      /* eslint-disable no-underscore-dangle */
      this.$router.push(
        { path: this.$route.path.slice(-1) === '/' ? `${this.$route.path}${suggestion.idName}` : `${this.$route.path}/${suggestion.idName}` }
      ).catch(
        error => { console.log(error); }
      );
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
    isSortSelectedLabelActive(label) {
      if (label === this.sortSelectedLabel) return true;
      return false;
    },
    isSortSelectedLabelInDropdown() {
      if (this.sortSelectedLabel === this.$t('message.sort.nameAZ')
        || this.sortSelectedLabel === this.$t('message.sort.nameZA')
        || this.sortSelectedLabel === this.$t('message.sort.lastCreated')) {
        return true;
      }
      return false;
    }
    // autocomplete(query) {
    //   this.autocompleteQuery(query)
    //     .then((response) => {
    //       this.autocompleteData.suggestions = [];
    //       const suggestions = response.data.result;
    //       const displayedSuggestions = [];
    //       for (const ds of suggestions.results) {
    //         displayedSuggestions.push(ds);
    //       }
    //       this.autocompleteData.suggestions = displayedSuggestions;
    //       this.autocompleteData.show = query.length !== 0;
    //     })
    //     .catch(() => {});
    // }
  },
  watch: {
    sortSelected: {
      handler(sort) {
        this.$router.replace({ query: Object.assign({}, this.$route.query, { sort }) })
          .catch(error => { console.log(error); });
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
  }
}
</script>

<style lang="scss" scoped>

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

.dropdown-item {
&:active {
   background-color: var(--dropdown-item-active-bg);
 }
}

.material-icons.small-icon {
  font-size: 20px;
}

.border-radius-start {
  border-top-left-radius: 1.875rem;
  border-bottom-left-radius: 1.875rem;
}
.border-radius-end {
  border-top-right-radius: 1.875rem;
  border-bottom-right-radius: 1.875rem;
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

.custom-dropdown-button {
  border: 1px solid black;
  padding: 0;
  background-color: white;
  outline: none;
}


.cursor-pointer {
  cursor: pointer;
}

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
.button-color-grey {
  background-color: rgba(0, 29, 133,0.1);
  color: black;
}

.search-button {
  border-radius: 100% !important;

  &:hover {
    background-color: #196fd2;
    border-color: #196fd2
  }
}

</style>
