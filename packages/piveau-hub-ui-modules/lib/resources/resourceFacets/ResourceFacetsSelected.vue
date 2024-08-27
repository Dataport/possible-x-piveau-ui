<template>
  <div class="container sfo-container">
    <p v-for="facet in getSelectedFacetsOrdered.filter(facet => showSelectedFacet(facet))" :key="facet.field">
      <span>
        {{ `${findFacetFieldTitle(facet)}:` }}
      </span>
      <span v-for="(facetId, i) in facet.facets" tabindex="0">
          <span :key="i" class="badge badge-pill badge-highlight mr-1 ds-label">
            {{ findFacetTitle(facet.field, facetId) }}
            <span @click="removeSelectedFacet(facet.field, facetId)" class="close-facet ml-2">&times;</span>
          </span>
      </span>
    </p>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useRuntimeEnv } from '../../composables/useRuntimeEnv';
import { useResourcesStore } from '../../store/resourcesStore';

import { isNil } from 'lodash-es';
import { getFacetTranslation } from '../../utils/helpers';

const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const ENV = useRuntimeEnv();
const resourcesStore = useResourcesStore();

const props = defineProps(['selectedFacets', 'availableFacets']);

const defaultFacetOrder = ref(ENV.content.resources.facets.facetOrder);

let selectedFacets: any = ref({});

function initFacets() {
    let facets: any = route.query.facets 
        ? JSON.parse(route.query.facets.toString())
        : {};

    selectedFacets = facets;
};

function routerPush(object: object) {
  return router.push(object).catch(error => { console.error(error) });
};

function showSelectedFacet(facet: object) {
  return facet.facets.length > 0
};

function findFacetTitle(fieldId: string, facetId: string) {
  try {
    if (fieldId === "superCatalog" && facetId === "erpd") return t("message.metadata.yes");
    if (fieldId === "is_hvd") return t("message.metadata.yes");

    const facetTitle = props.availableFacets.find(field => field.id === fieldId).items.find(facet => facet.id === facetId).title;

    return getFacetTranslation(fieldId, facetId, route.query.locale, facetTitle);
  } catch {
    return facetId;
  }
};

function findFacetFieldTitle(facet: object) {
  const fieldId = facet.field;

  try {
    let title = "";

    if(fieldId==='scoring'){
      title= t('message.header.navigation.data.metadataquality');
    } else if(fieldId==='superCatalog' && facet.facets.toString() === 'erpd'){
      title = t('message.datasetFacets.facets.erpd');
    } else if (route.path === '/catalogues' && fieldId==='country') {
      title = t(`message.datasetFacets.facets.origin`)
    } else{
      title = t(`message.datasetFacets.facets.${fieldId.toLowerCase()}`);
    }

    return !title.includes("@: message.metadata")? title : props.availableFacets.find(field => field.id === fieldId).title;

  } catch {
    return fieldId;
  }
};

function removeSelectedFacet(facetID: string, facetField: string) {
  if (!!selectedFacets[facetID] && selectedFacets[facetID].includes(facetField)) {
      let index = selectedFacets[facetID].indexOf(facetField);
      selectedFacets[facetID].splice(index, 1);
      if (selectedFacets[facetID].length === 0) {
          delete selectedFacets[facetID];
      }
  } else if (!selectedFacets[facetID]) {
      selectedFacets[facetID] = [];
      selectedFacets[facetID].push(facetField);
  } else {
      selectedFacets[facetID].push(facetField);
  }

  nextTick(() => {
    updateSelectedFacets();
  });
};

function updateSelectedFacets() {
  resourcesStore.mutations.setSelectedFacets(selectedFacets);

  let oldQuery = route.query;
  let newQuery = {};
  
  if (!!oldQuery.facets) delete oldQuery.facets;
  if (Object.keys(selectedFacets).length > 0) newQuery.facets = JSON.stringify(selectedFacets);

  routerPush({ query: Object.assign({}, oldQuery, newQuery) });
};

const getSelectedFacetsOrdered = computed(() => {
  const orderedFacets = [];

  defaultFacetOrder.value.forEach((facet) => {
    if (showCatalogDetails && facet === 'catalog') return;
    if (showCatalogDetails && facet === 'superCatalog') return;
    Object.keys(getSelectedFacets.value).forEach((field) => {
      if (facet === field && getSelectedFacets.value[field].length > 0) orderedFacets.push({
        field,
        facets: getSelectedFacets.value[field],
      });
    });
  });
  return orderedFacets;
});

const getSelectedFacets = computed(() => {
  if (route.query.dataScope && route.query.country && route.query.country.length > 0) {
    let newSelectedFacets = {};

    Object.keys(props.selectedFacets).map(key => {
      if (key === 'country') {
        newSelectedFacets['country'] = [];
        newSelectedFacets['dataScope'] = [];
        if (props.selectedFacets['country'].length === 0) {
          newSelectedFacets.dataScope.push(route.query.country[0]);
        } else {
          props.selectedFacets['country'].forEach(country => {
            if (country !== 'countryData') newSelectedFacets.country.push(country);
            newSelectedFacets.dataScope.push(country);
          });
        }
      }
      else newSelectedFacets[key] = props.selectedFacets[key];
    });

    if (route.query.dataScope === 'countryData') newSelectedFacets.dataScope = ['countryData'];

    // routerPush({ query: Object.assign({}, route.query) });

    return newSelectedFacets;

  } else if (route.query.dataScope && route.query.dataScope.length > 0) {
    let newSelectedFacets = {};

    Object.keys(props.selectedFacets).map(key => {
      if (key === 'country') {
        newSelectedFacets['country'] = [];
        newSelectedFacets['dataScope'] = [];
        if (props.selectedFacets['country'].length === 0) {
          newSelectedFacets.dataScope.push(route.query.dataScope);
        } else {
          props.selectedFacets['country'].forEach(country => {
            newSelectedFacets.dataScope.push(country);
          });
        }
      }
      else newSelectedFacets[key] = props.selectedFacets[key];
    });

    return newSelectedFacets;

  } else return props.selectedFacets;
});

const showCatalogDetails = computed(() => {
  return !isNil(route.params.ctlg_id) || !isNil(route.query.showsubcatalogs);
});

initFacets();
</script>

<style lang="scss" scoped>
  .close-facet {
    cursor: pointer;
  }
</style>
