<template>
  <div class="btn-group">
    <span class="mr-2">Select Resource:</span>
    <button class="d-flex align-items-center custom-dropdown-button" id="resourceFiltersSelect" type="button" data-toggle="dropdown" aria-expanded="false">
      <div class="pl-2 h-100 d-flex align-items-center">
        {{ $t(`message.header.navigation.data.${getSelectedResource}`) }}
      </div>
      <i class="pr-2 material-icons small-icon dropdown-icon">arrow_drop_down</i>
    </button>
    <ul class="dropdown-menu dropdown-menu-right" aria-labelledby="resourceFiltersSelect">
      <li 
        v-for="resourceID in getAvailableResources" 
        class="dropdown-item mb-0" 
        :title="$t(`message.tooltip.${resourceID}`)"
        data-toggle="tooltip"
        data-placement="top">
        <router-link
          :to="{name: 'ResourceSearchPage', params: { resource_id: resourceID }, query: { locale: $route.query.locale }}"
          class="nav-link"
          :class="{ 'router-link-active': resourceID === getSelectedResource, 'router-link-inactive': resourceID !== getSelectedResource}"
          role="presentation">
              {{ $t(`message.header.navigation.data.${resourceID}`) }}
        </router-link>
      </li>
      <li 
        class="dropdown-item mb-0" 
        :title="$t(`message.tooltip.datasets`)"
        data-toggle="tooltip"
        data-placement="top">
        <router-link
          :to="{name: 'Datasets', query: { locale: $route.query.locale }}"
          class="nav-link router-link-inactive"
          role="presentation">
              {{ $t(`message.header.navigation.data.datasets`) }}
        </router-link>
      </li>
      <li 
        class="dropdown-item mb-0" 
        :title="$t(`message.tooltip.catalogues`)"
        data-toggle="tooltip"
        data-placement="top">
        <router-link
          :to="{name: 'Catalogues', query: { locale: $route.query.locale }}"
          class="nav-link router-link-inactive"
          role="presentation">
              {{ $t(`message.header.navigation.data.catalogues`) }}
        </router-link>
      </li>
    </ul>
  </div>
</template>
  
<script>
import { useResourcesStore } from '../../store/resourcesStore';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ResourceFiltersSelect',
  data() {
    return {}
  },
  computed: {
      getSelectedResource() {
        return this.resourcesStore.getters.getSelectedResource;
      },
      getAvailableResources() {
        return this.resourcesStore.getters.getAvailableResources;
      },
  },
  methods: {},
  watch: {},
  setup() {
    const resourcesStore = useResourcesStore();
    return { resourcesStore };
  },
  created() {},
  mounted() {},
});
</script>