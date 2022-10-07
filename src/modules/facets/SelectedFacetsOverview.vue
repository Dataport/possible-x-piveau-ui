<template>
  <div class="container">
    <p v-for="fieldId in Object.keys(getSelectedFacets).filter(id => showSelectedFacet(id))" :key="fieldId">
      <span>
        {{ `${findFacetFieldTitle(fieldId)}:` }}
      </span>
      <span v-for="(facetId, i) in getSelectedFacets[fieldId]" :key="i" class="badge badge-pill badge-highlight mr-1 ds-label">
        {{ findFacetTitle(fieldId, facetId) }}
        <span @click="removeSelectedFacet(fieldId, facetId)" class="close-facet ml-2">&times;</span>
      </span>
    </p>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';
  import { getFacetTranslation } from '../utils/helpers';

  export default {
    name: 'SelectedFacetsOverview',
    components: {},
    props: {
      selectedFacets: {
        required: true,
      },
    },
    data() {
      return {
        availableFacets: [],
        showCatalogDetails: false,
      };
    },
    computed: {
      ...mapGetters('datasets', [
        'getAllAvailableFacets',
      ]),
      getSelectedFacets() {
        if (this.$route.query.dataScope && this.$route.query.country && this.$route.query.country.length > 0) {
          let newSelectedFacets = {};

          Object.keys(this.selectedFacets).map(key => {
            if (key === 'country') {
              newSelectedFacets['country'] = [];
              newSelectedFacets['dataScope'] = [];
              if (this.selectedFacets['country'].length === 0) {
                newSelectedFacets.dataScope.push(this.$route.query.country[0]);
              } else {
                this.selectedFacets['country'].forEach(country => {
                  if (country !== 'countryData') newSelectedFacets.country.push(country);
                  newSelectedFacets.dataScope.push(country);
                });
              }
            }
            else newSelectedFacets[key] = this.selectedFacets[key];
          });

          this.routerPush({ query: Object.assign({}, this.$route.query, { page: 1 }) });

          return newSelectedFacets;
        } else if (this.$route.query.dataScope && this.$route.query.dataScope.length > 0) {
          let newSelectedFacets = {};

          Object.keys(this.selectedFacets).map(key => {
            if (key === 'country') {
              newSelectedFacets['country'] = [];
              newSelectedFacets['dataScope'] = [];
              if (this.selectedFacets['country'].length === 0) {
                newSelectedFacets.dataScope.push(this.$route.query.dataScope);
              } else {
                this.selectedFacets['country'].forEach(country => {
                  newSelectedFacets.dataScope.push(country)
                });
              }
            }
            else newSelectedFacets[key] = this.selectedFacets[key];
          });

          return newSelectedFacets;
        } else return this.selectedFacets;
      },
      showCatalogDetailsWatcher() {
        return this.$route.query.showcatalogdetails;
      },
    },
    methods: {
      ...mapActions('datasets', [
        'setMinScoring',
      ]),
      routerPush(object) {
        return this.$router.push(object).catch(error => { console.log(error) });
      },
      showSelectedFacet(fieldId) {
        return this.getSelectedFacets[fieldId].length > 0
      },
      findFacetTitle(fieldId, facetId) {
        try {
          const facetTitle = this.getAllAvailableFacets.find(field => field.id === fieldId).items.find(facet => facet.id === facetId).title;
          return getFacetTranslation(fieldId, facetId, this.$route.query.locale, facetTitle);
        } catch {
          return facetId;
        }
      },
      findFacetFieldTitle(fieldId) {
        try {
          return this.getAllAvailableFacets.find(field => field.id === fieldId).title;
        } catch {
          return fieldId;
        }
      },
      removeSelectedFacet(field, facet) {
        this.toggleFacet(field, facet);
        this.$nextTick(() => {
          this.$emit('update-data');
        });
      },
      /**
       * @description Add/Remove a facet from the routers query parameters.
       * @param field - The field of the facet
       * @param facet - The given facet
       */
      toggleFacet(field, facet) {
        let routerObject = null;

        if (!Object.prototype.hasOwnProperty.call(this.$route.query, [field])) {
          routerObject = { query: Object.assign({}, this.$route.query, { [field]: [], page: 1 }) };
        } else if (field === 'scoring') {
          this.setMinScoring(0);
          localStorage.setItem('minScoring', JSON.stringify(0));
          routerObject = { query: Object.assign({}, this.$route.query, { scoring: [], page: 1 }) };
        } else if (field === 'dataScope') {
          routerObject = { query: Object.assign({}, this.$route.query, { country: [], dataScope: [], page: 1 }) };
        } else if (field === 'country') {
          routerObject = { query: Object.assign({}, this.$route.query, { country: [], page: 1 }) };
        }

        if (!routerObject) {
          let facets = this.$route.query[field].slice();

          if (!Array.isArray(facets)) facets = [facets];

          if (field === 'categories') {
            facet.toUpperCase();
            facets = facets.map(f => f.toUpperCase());
          }

          const index = facets.indexOf(facet);

          if (index > -1) {
            facets.splice(index, 1);
          } else {
            facets.push(facet);
          }

          routerObject = { query: Object.assign({}, this.$route.query, { [field]: facets, page: 1 }) };
        }

        return this.routerPush(routerObject);
      },
      initShowCatalogDetails() {
        const showCatalogDetails = this.$route.query.showcatalogdetails;
        if (showCatalogDetails === 'true') {
          this.showCatalogDetails = true;
        } else this.showCatalogDetails = false;
      },
    },
    watch: {
      showCatalogDetailsWatcher: {
        handler(showCatalogDetails) {
          this.showCatalogDetails = showCatalogDetails;
        },
      },
    },
    created() {
      this.initShowCatalogDetails();
    },
  };
</script>

<style lang="scss" scoped>

  .close-facet {
    cursor: pointer;
  }
</style>
