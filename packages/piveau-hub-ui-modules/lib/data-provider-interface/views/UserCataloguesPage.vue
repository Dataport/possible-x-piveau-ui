<template>
  <div class="d-flex flex-column bg-transparent container-fluid justify-content-between content">
    <h1 class="small-headline">My Catalogues</h1>
    <p class="m-0 subline">Click the catalogues if you want to be redirected to the associated overview Page.</p>
    <div class="catWrap">
      <div v-for="(catalog, index) in catalogues" :key="index" class="annifItems ">
        <app-link
          :to="{ name: 'CatalogueDetails', query: { locale: $route.query.locale }, params: { ctlg_id: catalog.id } }">{{
            catalog.title}}</app-link>
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
import {
  has,
  isNil,
} from 'lodash-es';
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
      catalogues: [],
    };
  },
  computed: {
    ...mapGetters('auth', [
      'getUserCatalogs',
      'getUserCatalogIds'
    ]),

  },
  methods: {
    has,
    isNil,
    // handleEdit(catalog) {
    //   this.$router.push({ name: 'DataProviderInterface-Edit', params: { catalog, property: 'catalogues' }, query: { locale: this.$route.query.locale }}).catch(() => {});
    // },
    async init() {

      await axios
        .get(this.$env.api.baseUrl + 'search?filter=catalogue&limit=100')
        .then(response => (this.info = response))
        .catch((err) => {
          reject(err);
        });

      this.info.data.result.results.forEach((e) => {
        if (has(e, 'title') && !isNil(e.title) && has(e, 'id') && !isNil(e.id)) this.catalogues.push({ title: Object.values(e.title)[0], id: e.id })
      });

      // TODO: Do we need this?
      // let cache = []
      // for (let i = 0; i < Object.keys(this.getUserCatalogIds).length; i++) {
      //   for (let a = 0; a < Object.keys(this.catalogues).length; a++) {
      //     if (this.getUserCatalogIds[i] === this.catalogues[a].id) {
      //       this.getUserCatalogIds[i] = this.catalogues[a].title;
      //       cache.push({id:this.catalogues[a].id, title: this.catalogues[a].title})
      //       break
      //     }
      //   }
      // }
      // this.catalogues = cache
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
  flex-grow: 1;
  text-align: center;
}

.subline {
  font-size: 12px;
  color: lightgray;

}
</style>