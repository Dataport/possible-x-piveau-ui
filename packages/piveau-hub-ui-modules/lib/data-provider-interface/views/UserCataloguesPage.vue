<template>
  <div class="d-flex flex-column bg-transparent container-fluid justify-content-between content">
    <h1 class="small-headline">My Catalogues</h1>
    <p class="m-0 subline">Click the catalogues if you want to be redirected to the associated overview Page.</p>
    <div class="catWrap">
      <div v-for="(catalog, index) in catalogues" :key="index" class="annifItems ">
        <app-link
          :to="{ name: 'CatalogueDetails', query: { locale: $route.query.locale }, params: { ctlg_id: catalog.id } }">{{
            catalog.title }}</app-link>
      </div>
    </div>
    <!-- <ul class="list-group col-md-6 m-auto">
      <li v-for="(catalog, index) in catalogues" :key="index" class="list-group-item">
        <app-link
          :to="{ name: 'CatalogueDetails', query: { locale: $route.query.locale }, params: { ctlg_id: catalog.id } }">{{
            catalog.title }}</app-link>
        <span class="float-right">
        </span>
      </li>
    </ul> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import AppLink from "../../widgets/AppLink.vue";
import axios from 'axios'

export default {
  components: {
    AppLink
  },
  name: 'MyCatalogues',
  props: [],
  data() {
    return {
      info: {},
      catalogues: []
    };
  },
  computed: {
    ...mapGetters('auth', [
      'getUserCatalogs',
    ]),

  },
  methods: {
    // handleEdit(catalog) {
    //   this.$router.push({ name: 'DataProviderInterface-Edit', params: { catalog, property: 'catalogues' }, query: { locale: this.$route.query.locale }}).catch(() => {});
    // },
    async init() {

      await axios
        .get('https://piveau-hub-search-data-europa-eu.apps.osc.fokus.fraunhofer.de/search?filter=catalogue&limit=100')
        .then(response => (this.info = response))
        .catch((err) => {
          reject(err);
        });
      this.info.data.result.results.forEach((e) => {
        this.catalogues.push({ title: Object.values(e.title)[0], id: e.id })
      });
    },
  },
  created() {
    this.init()

  },
};
</script>
<style>
.catWrap {
  display: flex;
  flex-wrap: wrap;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid lightgray;
  justify-content: space-between;
}

.catWrap .annifItems {
  background: #ECECEC;
}
.subline{
  font-size: 12px;
  color: lightgray ;
  
}
</style>