<template>
    <div class="input-group">
        <input type="text" class="form-control ds-input"
            :aria-label="$t('message.resources.searchBar.placeholder')"
            :placeholder="$t('message.resources.searchBar.placeholder')"
            v-model="query"
            @keyup.enter="changeQuery(query)"
            @click="autocompleteData.show = autocompleteData.suggestions.length > 0 && query.length > 0 ? !autocompleteData.show : false">
        <slot name="update-filter" :query="query" :search-fn="changeQuery">
        <div class="input-group-append">
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
</template>
  
<script>
import { useResourcesStore } from '../../store/resourcesStore';
import { getTranslationFor } from "../../utils/helpers";

export default {
  name: "ResourceFiltersSearch",
  data() {
    return {
      query: '',
      autocompleteData: {
        suggestions: {},
        show: true,
      },
    }
  },
  methods: {
    getTranslationFor,
    setSearchQuery(query) {
      this.query = query;
    },
    changeQuery(query) {
      this.$router.replace(
        { query: Object.assign({}, this.$route.query, { query }, { page: 1 }) }
      ).catch(
        error => { console.error(error); }
      );
    },
    handleSuggestionSelection(suggestion) {
      this.$router.push(
        { path: this.$route.path.slice(-1) === '/' ? `${this.$route.path}${suggestion.idName}` : `${this.$route.path}/${suggestion.idName}` }
      ).catch(
        error => { console.error(error); }
      );
    },
  },
  setup() {
    const resourcesStore = useResourcesStore();
    return { resourcesStore };
  },
  created() {
    this.$nextTick(() => {
      this.query = this.resourcesStore.getters.getQuery;
    });
  },
}
</script>