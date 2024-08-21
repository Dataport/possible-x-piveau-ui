<template>
  <div class="filters-group ds">
    <resource-filters-search v-if="useSearch"></resource-filters-search>
    <div class="d-flex justify-content-between mt-3">
      <resource-filters-select></resource-filters-select>
      <resource-filters-sort v-if="useSort"></resource-filters-sort>
    </div>
  </div>
</template>
  
<script lang="ts" setup>
import { useRuntimeEnv } from '../../composables/useRuntimeEnv';

import ResourceFiltersSearch from "./ResourceFiltersSearch.vue";
import ResourceFiltersSelect from "./ResourceFiltersSelect.vue";
import ResourceFiltersSort from "./ResourceFiltersSort.vue";

const ENV = useRuntimeEnv();

const useSearch = ENV.content.resources.search.useSearch;
const useSort = ENV.content.resources.sort.useSort;
</script>
