<template>
  <div class="resource-filters-select btn-group d-flex flex-row flex-wrap align-items-center ml-2">
    <span class="mr-2">Select Resource:</span>
    <button class="d-flex align-items-center custom-dropdown-button list-group-item p-0 py-1" id="resourceFiltersSelect" type="button" data-toggle="dropdown" aria-expanded="false">
      <div class="resource-filters-select-text">
        {{ $t(`message.header.navigation.data.${getSelectedResource}`) }}
      </div>
      <div class="resource-filters-select-icon text-white">
        <i class="material-icons">keyboard_arrow_down</i>
      </div>
    </button>
    <ul class="dropdown-menu dropdown-menu-right" aria-labelledby="resourceFiltersSelect">
      <li 
        v-for="resourceType in getAvailableResources" 
        class="dropdown-item mb-0 p-0" 
        :title="$t(`message.tooltip.${resourceType}`)"
        data-toggle="tooltip"
        data-placement="top">
        <router-link
          v-if="resourceType === 'datasets'"
          :to="{name: 'Datasets', query: { locale: $route.query.locale }}"
          class="nav-link"
          role="presentation">
              {{ $t(`message.header.navigation.data.datasets`) }}
        </router-link>
        <router-link
          v-else-if="resourceType === 'catalogues'"
          :to="{name: 'Catalogues', query: { locale: $route.query.locale }}"
          class="nav-link"
          role="presentation">
              {{ $t(`message.header.navigation.data.catalogues`) }}
        </router-link>
        <router-link
          v-else
          :to="{name: 'ResourceSearchPage', params: { resource_type: getRawResourceType(resourceType) }, query: { locale: $route.query.locale }}"
          class="nav-link"
          role="presentation">
              {{ $t(`message.header.navigation.data.${resourceType}`) }}
        </router-link>
      </li>
    </ul>
  </div>
</template>
  
<script lang="ts" setup>
import { computed } from 'vue';
import { useRuntimeEnv } from '../../composables/useRuntimeEnv';
import { useResourcesStore } from '../../store/resourcesStore';

const ENV = useRuntimeEnv();
const resourcesStore = useResourcesStore();

const getSelectedResource = computed(() => {
  return resourcesStore.getters.getSelectedResource;
});

const getAvailableResources = computed(() => {
  return resourcesStore.getters.getAvailableResources;
});

const getRawResourceType = (type) => {
  return Object.keys(ENV.content.resources.resourceMapping)[Object.values(ENV.content.resources.resourceMapping).indexOf(type)];
};
</script>

<style lang="scss">
.resource-filters-select {

  .resource-filters-select-text {
    padding: 0 4rem 0 0.5rem !important;
    height: 100% !important;
  }

  .resource-filters-select-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    width: 2.75rem;
    background-color: var(--primary);

    .material-icons {
      font-size: 30px;
    }
  }
}
</style>