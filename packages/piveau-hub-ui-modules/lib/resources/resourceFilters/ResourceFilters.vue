<template>
  <div class="filters-group ds">
    <slot name="search-bar">
      <resource-filters-search v-if="useSearch"></resource-filters-search>
    </slot>
    <slot name="filters-tabs">
      <div class="d-flex justify-content-between mt-3">
        <resource-filters-select></resource-filters-select>
        <resource-filters-sort v-if="useSort"></resource-filters-sort>
      </div>
      
    </slot>
  </div>
</template>
  
<script lang="ts" setup>
import { useRuntimeEnv } from '../../composables/useRuntimeEnv';

import ResourceFiltersSearch from "./ResourceFiltersSearch";
import ResourceFiltersSelect from "./ResourceFiltersSelect";
import ResourceFiltersSort from "./ResourceFiltersSort";

const ENV = useRuntimeEnv();

const useSearch = ENV.content.resources.search.useSearch;
const useSort = ENV.content.resources.sort.useSort;
</script>
