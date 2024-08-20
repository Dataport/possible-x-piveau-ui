<template>
    <div class="input-group">
        <input type="text" class="form-control ds-input"
            :aria-label="$t('message.resources.searchBar.placeholder')"
            :placeholder="$t('message.resources.searchBar.placeholder')"
            v-model="query"
            @keyup.enter="changeQuery(query)"
            @click="autocompleteData.show = autocompleteData.suggestions.length > 0 && query.length > 0 ? !autocompleteData.show : false">
        <div class="input-group-append">
            <button class="btn btn-sm btn-primary d-flex align-items-center search-button ds-input" type="button" @click="changeQuery(query)">
            <i class="material-icons align-bottom">search</i>
            </button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

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

function changeQuery(query: string) {
  resourcesStore.mutations.setQuery(query);
  router.replace(
    { query: Object.assign({}, route.query, { query }, { page: 1 }) }
  ).catch(
    error => { console.error(error); }
  );
};

query = route.query.query || '';
</script>