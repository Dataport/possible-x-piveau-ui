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
  
<script>
import ResourceFiltersSearch from "./ResourceFiltersSearch";
import ResourceFiltersSelect from "./ResourceFiltersSelect";
import ResourceFiltersSort from "./ResourceFiltersSort";

export default {
  name: "ResourceFilters",
  components: {
    ResourceFiltersSearch,
    ResourceFiltersSelect,
    ResourceFiltersSort,
  },
  data() {
    return {
      useSearch: this.$env.content.resources.search.useSearch,
      useSort: this.$env.content.resources.sort.useSort,
    }
  },
  created() {},
  methods: {},
}
</script>