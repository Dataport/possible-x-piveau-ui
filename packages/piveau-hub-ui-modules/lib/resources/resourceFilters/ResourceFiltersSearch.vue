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

<script lang="ts" setup>
import { ref, nextTick } from 'vue';

import { useRoute, useRouter } from 'vue-router';
import { useResourcesStore } from '../../store/resourcesStore';

const route = useRoute();
const router = useRouter();
const resourcesStore = useResourcesStore();

let query = ref('');
const autocompleteData = ref({
  suggestions: {},
  show: true,
});

function setSearchQuery(searchQuery) {
  query = searchQuery;
};

function changeQuery(query) {
  router.replace(
    { query: Object.assign({}, route.query, { query }, { page: 1 }) }
  ).catch(
    error => { console.error(error); }
  );
};

function handleSuggestionSelection(suggestion) {
  router.push(
    { path: route.path.slice(-1) === '/' ? `${route.path}${suggestion.idName}` : `${route.path}/${suggestion.idName}` }
  ).catch(
    error => { console.error(error); }
  );
};

nextTick(() => {
  query = resourcesStore.getters.getQuery;
});
</script>